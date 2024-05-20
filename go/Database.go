package main

import (	
	"database/sql"	
	"fmt"
	"strconv"
	"time"
	"log"
	"net/http"
	"encoding/json"
)

type Laadpaal struct {
	ID     int `json:"id"`
	Status string `json:"status"`
}

// alle methods/functies die te maken hebben met de database
func Maketables(db *sql.DB) error {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS Users (ID INTEGER PRIMARY KEY, Username VARCHAR(255), Email VARCHAR(255), Password VARCHAR(255))")
	_, err = db.Exec(
		"CREATE TABLE IF NOT EXISTS Reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, LaadpaalID INTEGER, Date DATETIME, Priority INTEGER, Opgeladen BOOLEAN, Opgehaald BOOLEAN)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS Medewerkers (id INTEGER PRIMARY KEY AUTOINCREMENT, Voornaam VARCHAR(255), Achternaam VARCHAR(255), Email VARCHAR(255), Adress VARCHAR(255), TelefoonNummer VARCHAR(255), PostCode VARCHAR(255), Provincie VARCHAR(255), AutoModel VARCHAR(255), AutoCapaciteit VARCHAR(255));")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS Laadpalen (id INTEGER PRIMARY KEY AUTOINCREMENT, status BOOLEAN)")
	return err
}
func AddUser(db *sql.DB, username string, email string, password string) error {
	_, err := db.Exec("INSERT INTO Users (Username, Email, Password) VALUES (?, ?, ?)", username, email, password)
	return err
}

func AddReservation(db *sql.DB, userID int, laadpaalID int, date time.Time, priority int, opgeladen bool, opgehaald bool) error {
	_, err := db.Exec("INSERT INTO Reservations (UserID, LaadpaalID, Date, Priority, Opgeladen, Opgehaald) VALUES (?, ?, ?, ?, ?, ?)", userID, laadpaalID, date, priority, opgeladen, opgehaald)
	return err
}

func AddMedewerker(db *sql.DB, voornaam string, achternaam string, email string, adress string, telefoonNummer string, postCode string, provincie string, autoModel string, autoCapaciteit string) error {
	_, err := db.Exec("INSERT INTO Medewerkers (Voornaam, Achternaam, Email, Adress, TelefoonNummer, PostCode, Provincie, AutoModel, AutoCapaciteit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", voornaam, achternaam, email, adress, telefoonNummer, postCode, provincie, autoModel, autoCapaciteit)
	return err
}

func AddLaadpaal(db *sql.DB, status bool) error {
	_, err := db.Exec("INSERT INTO Laadpalen (status) VALUES (?)", status)
	return err
}

func PrintUsers(db *sql.DB) error {
	rows, err := db.Query("SELECT * FROM Users")
	if err != nil {
		return err
	}
	defer rows.Close()

	var id int
	var username, email, password string
	for rows.Next() {
		if err := rows.Scan(&id, &username, &email, &password); err != nil {
			return err
		}
		fmt.Println(strconv.Itoa(id) + ": " + username + " " + email)
	}
	return nil
}

func GetAvailableStations(w http.ResponseWriter, r *http.Request, db *sql.DB){	
	// krijg alle laadpalen die beschikbaar zijn
	laadpalen, err := GetAllLaadpalen(db)
	if err != nil {
		log.Fatal(err) // log.Fatal will log the error and stop the program
	}
	// nu je alle laadpalen hebt, zorg dat je nu op basis van datum en tijd kijkt of er een reservatie is en beschikbaar zijn
	// Decode the JSON request body into a struct (genomen van henno is meer monkey code hieronder, wil het graag testen op school met henno)
	var requestData struct {
		Date       string `json:"Date"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Parse the date string into a time.Time object
	date, err := time.Parse(time.RFC3339, requestData.Date)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	var filtered []Laadpaal
	reservationId, err := CheckforReservation(db, date)
	if err != nil {
		panic(err) // Handle errors appropriately
	}

	if reservationId > 0 {
		// gevonden niks doen
		// fmt.Println("Laadpaal is gereserveerd", reservationId)

	} else {
		// niks gevonden, voeg toe aan nieuwe lijst
		for _, laadpaal := range laadpalen {
			if laadpaal.ID != reservationId {
			  filtered = append(filtered, laadpaal)
			}
		  }
	}
	// Encode filtered laadpalen into JSON and write to response (gemini code)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(filtered)
}

func GetAllLaadpalen(db *sql.DB) ([]Laadpaal, error) {
	// Get all laadpalen
	rows, err := db.Query("SELECT ID, Status FROM Laadpalen")
	if err != nil {
		log.Fatal(err) // log.Fatal will log the error and stop the program
	}
	defer rows.Close()

	// Check if the laadpalen are not null
	var laadpalen []Laadpaal
	for rows.Next() {
		var laadpaal Laadpaal
		if err := rows.Scan(&laadpaal.ID, &laadpaal.Status); err != nil {
			log.Fatal(err) // log.Fatal will log the error and stop the program
		}
		laadpalen = append(laadpalen, laadpaal)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		log.Fatal(err) // log.Fatal will log the error and stop the program
	}

	return laadpalen, nil
}
func CheckforReservation(db *sql.DB, datum time.Time) (int, error) {
	// Prepare the SQL query
	query := `SELECT LaadpaalID FROM reservations WHERE date = ?`

	// Execute the query with the provided date
	row := db.QueryRow(query, datum)

	// Check for errors
	err := row.Err()
	if err != nil {
		return 0, err
	}

	// Scan for the reservation ID (if any)
	var id int
	err = row.Scan(&id)

	// Handle the case where no reservation is found
	if err == sql.ErrNoRows {
		return 0, nil // No reservation found (not an error)
	}

	// Check for other potential errors
	if err != nil {
		return 0, err
	}

	// Return the reservation ID
	return id, nil
}