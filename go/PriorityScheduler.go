package main

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
	"time"
	"log"
	"net/http"
	"encoding/json"
)

func PriorityScheduler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// Decode the JSON request body into a struct (genomen van henno is meer monkey code hieronder)
	var requestData struct {
		Date       string `json:"Date"`
	}

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
    // TODO: roep method aan die de laadpalen voor ons update
    UpdateLaadpalen(db, date)

	GetQRLaadpalen(db, w, date) // via deze method returne we de laadpalen die niet bezet zijn
}

// UpdateLaadpalen updates the "SystemLaadpalen" table based on reservations
func UpdateLaadpalen(db *sql.DB, Date time.Time) {
    // Retrieve all Laadpalen
    laadpalen, err := GetAllLaadpalen(db) // vanuit databbase.go
    if err != nil {
        log.Fatal(err)
    }

    // Retrieve busy Laadpalen IDs
    busyLaadpalenIDs, err := GetBusyLaadpalen(db, Date, GetNextHour(Date))
    if err != nil {
        log.Fatal(err)
    }

    // Update or insert records in the "SystemLaadpalen" table
    err = UpdateSystemLaadpalen(db, laadpalen, busyLaadpalenIDs)
    if err != nil {
        log.Fatal(err)
    }

    // TODO: Handle error indeien data niet overeenkomt met api laadpalen table
}

func GetQRLaadpalen(db *sql.DB, w http.ResponseWriter, date time.Time) {
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
    

// Update or insert records in the "SystemLaadpalen" table based on reservation status
func UpdateSystemLaadpalen(db *sql.DB, laadpalen []Laadpaal, busyLaadpalenIDs []int) error {
    // Start a transaction
    tx, err := db.Begin()
    if err != nil {
        return err
    }
    defer func() {
        if err != nil {
            tx.Rollback()
            return
        }
        tx.Commit()
    }()

    // Check if the SystemLaadpalen table exists
    var tableExists bool
    if err := tx.QueryRow("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'SystemLaadpalen')").Scan(&tableExists); err != nil {
        return err
    }

    // If the table doesn't exist, create it
    if !tableExists {
        _, err := tx.Exec(`CREATE TABLE SystemLaadpalen (
            id INT PRIMARY KEY,
            is_busy BOOLEAN
        )`)
        if err != nil {
            return err
        }
    }

    // Update or insert records in the "SystemLaadpalen" table
    for _, laadpaal := range laadpalen {
        isBusy := contains(busyLaadpalenIDs, laadpaal.ID)
        // Check if the laadpaal already exists in the SystemLaadpalen table
        var count int
        if err := tx.QueryRow("SELECT COUNT(*) FROM SystemLaadpalen WHERE id = ?", laadpaal.ID).Scan(&count); err != nil {
            return err
        }
        if count > 0 { // todat alle laadpalen zijn geweest
            // Update the existing record
            _, err := tx.Exec("UPDATE SystemLaadpalen SET is_busy = ? WHERE id = ?", isBusy, laadpaal.ID)
            if err != nil {
                return err
            }
        } else { // indien het er dus niet is add je hem
            // Insert a new record
            _, err := tx.Exec("INSERT INTO SystemLaadpalen (id, is_busy) VALUES (?, ?)", laadpaal.ID, isBusy)
            if err != nil {
                return err
            }
        }
    }
    return nil
}


// Utility function to check if an ID exists in a slice
func contains(ids []int, id int) bool {
    for _, i := range ids {
        if i == id {
            return true
        }
    }
    return false
}

func GetNextHour(date time.Time) time.Time {
	return date.Add(time.Hour)
}

func GetBusyLaadpalen(db *sql.DB, startDate, endDate time.Time) ([]int, error) {
	query := "SELECT laadpaal_id FROM reserveringen WHERE datum BETWEEN ? AND ?"
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