package main

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
	"time"
	"log"
	"net/http"
	"encoding/json"
)

func GetLaadpalenQRhandeler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// Decode the JSON request body into a struct (genomen van henno is meer monkey code hieronder)
	var requestData struct {
		Date       string `json:"Date"`
	}
    
    // eigenlijk zou je hier al moeten kijken in de api 1-5 minuten kunnen er tussen zijn, kijken welke nog steeds occupied zijn en tbh idk krijg brain lagg nu
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Println("Received date:", requestData.Date)
	// Parse the date string into a time.Time object
	date, err := ParseDate(requestData.Date)
	if err != nil {
		http.Error(w, "Invalid date format: "+err.Error(), http.StatusBadRequest)
		return
	}

	GetQRLaadpalen(db, w, date) // via deze method returne we de laadpalen die niet bezet zijn
}

func GetQRLaadpalen(db *sql.DB, w http.ResponseWriter, date time.Time) {
    // dit is duus een method die terug stuurt aan de qr welke laadpalen tussen 2 data's vrij is
	dateNextHour := GetNextHour(date)

	busyLaadpalenIDs, err := GetBusyLaadpalen(db, date, dateNextHour)
	if err != nil {
		http.Error(w, "Error querying database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	laadpalen, err := GetAllLaadpalen(db) // vanuit databbase.go
	if err != nil {
		http.Error(w, "Error retrieving laadpalen: "+err.Error(), http.StatusInternalServerError)
		return
	}

	filteredLaadpalen := FilterLaadpalen(laadpalen, busyLaadpalenIDs)

	WriteResponse(w, filteredLaadpalen)
}

func GetNextHour(date time.Time) time.Time {
	return date.Add(time.Hour)
}

func GetBusyLaadpalen(db *sql.DB, startDate, endDate time.Time) ([]int, error) {
	query := "SELECT LaadpaalID  FROM Reservations WHERE Date BETWEEN ? AND ?"
	rows, err := db.Query(query, startDate, endDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var busyLaadpalenIDs []int
	for rows.Next() {
		var laadpaalID int
		if err := rows.Scan(&laadpaalID); err != nil {
			return nil, err
		}
		busyLaadpalenIDs = append(busyLaadpalenIDs, laadpaalID)
	}

	return busyLaadpalenIDs, nil
}

func FilterLaadpalen(laadpalen []Laadpaal, busyLaadpalenIDs []int) []Laadpaal {
	busyLaadpalenMap := make(map[int]bool)
	for _, id := range busyLaadpalenIDs {
		busyLaadpalenMap[id] = true
	}

	var filtered []Laadpaal
	for _, laadpaal := range laadpalen {
		if !busyLaadpalenMap[laadpaal.ID] {
			filtered = append(filtered, laadpaal)
		}
	}

	return filtered
}

func WriteResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(data)
}