package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	_ "github.com/mattn/go-sqlite3"
	"time"
)

var (
	nameStore string
	mu        sync.Mutex // Mutex for synchronizing access to nameStore
)

func main() {
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

  // zorg dat de db up to date is
	UpdateDB()

	// start de server of 8080 en voeg CORS headers toe
	http.HandleFunc("/checkAccounts", checkAccountsHandler(database))
  	http.HandleFunc("/readAccounts", GetAccounts)
	http.HandleFunc("/getName", getNameHandler) // Endpoint to get the name
	http.HandleFunc("/setName", setNameHandler) // Endpoint to set the name
  
	// http.HandleFunc("/addReservation", AddReservation) // Endpoint to insert a new reservation
	http.HandleFunc("/getAvailableStations", func(w http.ResponseWriter, r *http.Request){
	    // Call the actual handler function with the argument
	    GetAvailableStations(w, r, database)
    
	}) // Endpoint voor het ophalen van beschikbare stations op specifieke datum en tijd
	http.HandleFunc("/addReservation", func(w http.ResponseWriter, r *http.Request) { // Endpoint to insert a new reservation
        // Call the actual handler function with the argument
        AddReservationHandler(w, r, database)
    })

	fmt.Println("Server is running...")
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

func AddReservationHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	// Decode the JSON request body into a struct
	var requestData struct {
		UserID     int    `json:"UserID"`
		LaadpaalID int    `json:"LaadpaalID"`
		Date       string `json:"Date"`
		Priority   int    `json:"Priority"`
		Opgeladen  bool   `json:"Opgeladen"`
		Opgehaald  bool   `json:"Opgehaald"`
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

	// fmt.Println("Received reservation:", requestData)

	// Insert the reservation into the database
	if err := AddReservation(database, requestData.UserID, requestData.LaadpaalID, date, requestData.Priority, requestData.Opgeladen, requestData.Opgehaald); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}
