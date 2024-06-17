package main

import (	
	"database/sql"	
	"fmt"
	"time"
	"log"
	"net/http"
	"encoding/json"
	"strconv"
)

type Laadpaal struct {
	ID     int `json:"id"`
	Status string `json:"status"`
}

type User struct {
	ID	   int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	OktaID   sql.NullString `json:"oktaId"`
	Medewerker_ID sql.NullInt64 `json:"medewerkerId"`
}

type Reservation struct {
	ID     int `json:"id"`
	UserID int `json:"userID"`
	LaadpaalID int `json:"laadpaalID"`
	Date time.Time `json:"date"`
	Priority int `json:"priority"`
	Opgeladen bool `json:"opgeladen"`
	Opgehaald bool `json:"opgehaald"`
}

// alle methods/functies die te maken hebben met de database
func Maketables(db *sql.DB) error {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS Users (ID INTEGER PRIMARY KEY AUTOINCREMENT, Username VARCHAR(255), Email VARCHAR(255), Password VARCHAR(255), OktaId VARCHAR(255) NULL, Medewerker_ID INTEGER NULL, FOREIGN KEY(Medewerker_ID) REFERENCES Medewerkers(id) ON DELETE SET NULL)")
	_, err = db.Exec(
		"CREATE TABLE IF NOT EXISTS Reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, LaadpaalID INTEGER, Date DATETIME, Priority INTEGER, Opgeladen BOOLEAN, Opgehaald BOOLEAN)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS Medewerkers (id INTEGER PRIMARY KEY AUTOINCREMENT, Voornaam VARCHAR(255), Achternaam VARCHAR(255), Email VARCHAR(255), Adress VARCHAR(255), TelefoonNummer VARCHAR(255), PostCode VARCHAR(255), Provincie VARCHAR(255), AutoModel VARCHAR(255), AutoCapaciteit VARCHAR(255))")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS Laadpalen (id INTEGER PRIMARY KEY AUTOINCREMENT, status BOOLEAN)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS QuickReserveReservations (id INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, Date DATETIME, Priority INTEGER)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS Meldingen (ID INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, Melding VARCHAR(255), DateOfNotification DATETIME)") 
	return err
}

func AddReservation(db *sql.DB, userID int, laadpaalID int, date time.Time, priority int, opgeladen bool, opgehaald bool) error {
	_, err := db.Exec("INSERT INTO Reservations (UserID, LaadpaalID, Date, Priority, Opgeladen, Opgehaald) VALUES (?, ?, ?, ?, ?, ?)", userID, laadpaalID, date, priority, opgeladen, opgehaald)
	return err
}

func AddQuickReservation(db *sql.DB, userID int, date time.Time, priority int) error {
	_, err := db.Exec("INSERT INTO QuickReserveReservations (UserID, Date, Priority) VALUES (?, ?, ?)", userID, date, priority)
	return err
}

func AddLaadpaal(db *sql.DB, status bool) error {
	_, err := db.Exec("INSERT INTO Laadpalen (status) VALUES (?)", status)
	return err
}

func LinkOktaId(db *sql.DB, userId int, oktaId string) error {
	_, err := db.Exec("UPDATE Users SET OktaId = ? WHERE ID = ?", oktaId, userId)
	return err
}

func LinkOktaIdHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.FormValue("id")
		oktaId := r.FormValue("oktaId")

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		err = LinkOktaId(db, id, oktaId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"User OktaId updated successfully"}`))
	}
}

func GetAllReservationsOfUser(db *sql.DB, userID int) ([]Reservation, error) {
	rows, err := db.Query("SELECT * FROM Reservations WHERE UserID = ?", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservations []Reservation
	for rows.Next() {
		var reservation Reservation
		if err := rows.Scan(&reservation.ID, &reservation.UserID, &reservation.LaadpaalID, &reservation.Date, &reservation.Priority, &reservation.Opgeladen, &reservation.Opgehaald); err != nil {
			return nil, err
		}
		reservations = append(reservations, reservation)
	}
	return reservations, nil
}

func GetAllUsers(db *sql.DB) ([]User, error) {
    rows, err := db.Query("SELECT * FROM Users")
    if err != nil {
        log.Fatal(err) // log.Fatal will log the error and stop the program
    }
    defer rows.Close()

    // Check if the laadpalen are not null
    var Users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.OktaID, &user.Medewerker_ID); err != nil {
            log.Fatal(err) // log.Fatal will log the error and stop the program
        }
        Users = append(Users, user)
    }

    // Check for errors from iterating over rows
    if err := rows.Err(); err != nil {
        log.Fatal(err) // log.Fatal will log the error and stop the program
    }
    log.Println("stuur lijst terug")
    return Users, nil
}

func GetAvailableStations(w http.ResponseWriter, r *http.Request, db *sql.DB){	
	// krijg alle laadpalen die beschikbaar zijn
	// Log that the request has been received
	log.Println("Request received at /getAvailableStations")
	laadpalen, err := GetAllLaadpalen(db)
	if err != nil {
		log.Fatal(err) // log.Fatal will log the error and stop the program
	}
	log.Println("Laadpalen fetched from the database ", laadpalen)
	// nu je alle laadpalen hebt, zorg dat je nu op basis van datum en tijd kijkt of er een reservatie is en beschikbaar zijn
	// Decode the JSON request body into a struct (genomen van henno is meer monkey code hieronder, wil het graag testen op school met henno)
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
	log.Println("Parsed date:", date)
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
			fmt.Println("Laadpaal ID:", laadpaal.ID)
			fmt.Println("Laadpaal Status:", reservationId)
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
	log.Println("Fetching all laadpalen from the database")
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
	log.Println("stuur lijst terug")
	return laadpalen, nil
}

func CheckforReservation(db *sql.DB, datum time.Time) (int, error) {
	log.Println("Checking for reservation in the database")
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

func GetAllReservationOfDate(db *sql.DB, datum time.Time) ([]Reservation, error) {
	// Get all reservations of a specific date
	rows, err := db.Query("SELECT * FROM reservations WHERE DATE(Date) = DATE(?)", datum) // Converting both dates to DATE to ignore the time part
	if err != nil {
		return nil, fmt.Errorf("query error: %v", err) // return the error
	}
	defer rows.Close()

	var reservations []Reservation

	// Iterate through the result set
	for rows.Next() {
		var reservation Reservation
		// Scan the row into the reservation object
		if err := rows.Scan(&reservation.ID, &reservation.UserID, &reservation.LaadpaalID, &reservation.Date, &reservation.Priority, &reservation.Opgeladen, &reservation.Opgehaald); err != nil {
			return nil, fmt.Errorf("scan error: %v", err) // return the error
		}
		
		reservations = append(reservations, reservation)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %v", err) // return the error
	}
	
	// Return the reservations
	return reservations, nil
}

func AddMelding(db *sql.DB, userID int, melding string, dateOfNotification time.Time) error {
	_, err := db.Exec("INSERT INTO Meldingen (UserID, Melding, DateOfNotification) VALUES (?, ?, ?)", userID, melding, dateOfNotification)
	return err
}

func updateUser(db *sql.DB, id, username, password string) error {
    var err error
    if password != "" && username != "" {
        _, err = db.Exec("UPDATE Users SET Username = ?, Password = ? WHERE ID = ?", username, password, id)
        if err != nil {
            return fmt.Errorf("error updating username and password: %v", err)
        }
    } else if password != "" {
        _, err = db.Exec("UPDATE Users SET Password = ? WHERE ID = ?", password, id)
        if err != nil {
            return fmt.Errorf("error updating password: %v", err)
        }
    } else if username != "" {
        _, err = db.Exec("UPDATE Users SET Username = ? WHERE ID = ?", username, id)
        if err != nil {
            return fmt.Errorf("error updating username: %v", err)
        }
    }

    return nil
}