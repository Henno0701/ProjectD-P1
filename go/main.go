package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Item struct {
	ID         int    `json:"id"`
	UserID     string `json:"UserID"`
	LaadpaalID int    `json:"LaadpaalID"`
	Date       string `json:"Date"`
	Priority   int    `json:"Priority"`
	Opgeladen  bool   `json:"Opgeladen"`
	Opgehaald  bool   `json:"Opgehaald"`
}

var (
	nameStore string
	mu        sync.Mutex // Mutex for synchronizing access to nameStore
)

func getItems(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	log.Println("Received request for /items")
	rows, err := db.Query("SELECT ID, UserID, LaadpaalID, Date, Priority, Opgeladen, Opgehaald FROM Reservations")
	if err != nil {
		log.Println("Error querying database:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []Item
	for rows.Next() {
		var item Item
		err := rows.Scan(&item.ID, &item.UserID, &item.LaadpaalID, &item.Date, &item.Priority, &item.Opgeladen, &item.Opgehaald)
		if err != nil {
			log.Println("Error scanning row:", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	log.Println("Returning items:", items)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func main() {
	// Open database connection
	database, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer database.Close()

	// Create tables
	if err := Maketables(database); err != nil {
		log.Fatalf("Error creating tables: %v", err)
	}

	// Add a user
	if err := AddUser(database, "Henno", "Passchier", "faggie"); err != nil {
		log.Fatalf("Error adding user: %v", err)
	}

	// Print users
	if err := PrintUsers(database); err != nil {
		log.Fatalf("Error printing users: %v", err)
	}

	// Insert dummy data
	if err := InsertDummyData(database); err != nil {
		log.Fatalf("Error inserting dummy data: %v", err)
	}

	// message in the console so you know the server is running
	log.Println("Server is running...")

	http.HandleFunc("/items", func(w http.ResponseWriter, r *http.Request) {
		getItems(w, r, database)
	})
	http.HandleFunc("/checkAccounts", checkAccountsHandler(database))
	http.HandleFunc("/getName", getNameHandler) // Endpoint to set the name
	http.HandleFunc("/setName", setNameHandler) // Endpoint to set the name
	http.HandleFunc("/addReservation", AddReservation) // Endpoint to insert a new reservation
	fmt.Println("Server is running...")

	log.Fatal(http.ListenAndServe(":8080", addCorsHeaders(http.DefaultServeMux)))
}

// Start the server with CORS headers
func addCorsHeaders(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		handler.ServeHTTP(w, r)
	})
}

func getNameHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	// Send the name stored in the server
	response := map[string]string{"name": nameStore}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Set response headers and write the response

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}

func setNameHandler(w http.ResponseWriter, r *http.Request) {
	// Decode the JSON request body into a struct
	var requestData struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Update the name in the store
	mu.Lock()
	nameStore = requestData.Name
	mu.Unlock()

	// Print the received name to the console
	fmt.Println("Received name:", requestData.Name)

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func Maketables(db *sql.DB) error {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS Users (ID INTEGER PRIMARY KEY, Username VARCHAR(255), Email VARCHAR(255), Password VARCHAR(255))")
	if err != nil {
		return err
	}
	_, err = db.Exec(
		"CREATE TABLE IF NOT EXISTS Reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, LaadpaalID INTEGER, Date DATETIME, Priority INTEGER, Opgeladen BOOLEAN, Opgehaald BOOLEAN)")
	if err != nil {
		return err
	}
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS Medewerkers (id INTEGER PRIMARY KEY AUTOINCREMENT, Voornaam VARCHAR(255), Achternaam VARCHAR(255), Email VARCHAR(255), Adress VARCHAR(255), TelefoonNummer VARCHAR(255), PostCode VARCHAR(255), Provincie VARCHAR(255), AutoModel VARCHAR(255), AutoCapaciteit VARCHAR(255));")
	if err != nil {
		return err
	}
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

func InsertDummyData(db *sql.DB) error {
	// Add a user
	if err := AddUser(db, "Jullian", "1037131@hr.nl", "Test1234"); err != nil {
		return err
	}
	// Add a reservation
	date, _ := time.Parse("2006-01-02", "2025-06-01")
	if err := AddReservation(db, 1, 1, date, 1, false, false); err != nil {
		return err
	}
	// Add a worker
	if err := AddMedewerker(db, "Jullian", "Goncalves", "1037131@hr.nl", "Wijnhaven 107", "0612345678", "1234AB", "Zuid-Holland", "Volkswagen Passat", "5000"); err != nil {
		return err
	}
	// Add a laadpaal
	if err := AddLaadpaal(db, false); err != nil {
		return err
	}
	return nil
}
