package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"net/http"
	"strconv"
	"sync"
)

var (
	nameStore string
	mu        sync.Mutex // Mutex for synchronizing access to nameStore
)

func main() {
	// maak de endpoints zodat de client gegevens kan ophalen en versutren
	http.HandleFunc("/getName", getNameHandler)
	http.HandleFunc("/setName", setNameHandler)

	// stuff voor db
	// Open database connection
	database, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		fmt.Println("Error opening database:", err)
		return
	}
	defer database.Close() // Close the database connection when main function exits

	// Create tables
	if err := Maketables(database); err != nil {
		fmt.Println("Error creating tables:", err)
		return
	}

	// Add a user
	if err := AddUser(database, "Henno", "Passchier", "faggie"); err != nil {
		fmt.Println("Error adding user:", err)
		return
	}

	// Print users
	if err := PrintUsers(database); err != nil {
		fmt.Println("Error printing users:", err)
		return
	}

	// message in de console zodat je weet dat de server runt
	fmt.Println("Server is running...")

	// start de server of 8080 en voeg CORS headers toe
	http.ListenAndServe(":8080", addCorsHeaders(http.DefaultServeMux))
}

func addCorsHeaders(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
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
	return err
}

func AddUser(db *sql.DB, username string, email string, password string) error {
	_, err := db.Exec("INSERT INTO Users (Username, Email, Password) VALUES (?, ?, ?)", username, email, password)
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
