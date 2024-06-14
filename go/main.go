package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	_ "github.com/mattn/go-sqlite3"
	"time"
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

  	// zorg dat de db up to date is
	UpdateDB()
	
	// start de server of 8080 en voeg CORS headers toe
	http.HandleFunc("/checkAccounts", checkAccountsHandler(database))
  	http.HandleFunc("/readAccounts", GetAccounts)
	http.HandleFunc("/getName", getNameHandler) // Endpoint to get the name
	http.HandleFunc("/setName", setNameHandler) // Endpoint to set the name
	http.HandleFunc("/getAllLaadpalen", GetAllLaadpalenHandler(database)) // Endpoint to get all laadpalen
	http.HandleFunc("/getAllUsers", GetAllLaadpalenHandler(database)) // Endpoint to get all laadpalen
	http.HandleFunc("/addReservation", func(w http.ResponseWriter, r *http.Request) { // Endpoint to insert a new reservation
        // Call the actual handler function with the argument
        AddReservationHandler(w, r, database)
    })

	http.HandleFunc("/getAllReservationsOfUser", func(w http.ResponseWriter, r *http.Request) { // Endpoint to insert a new reservation
		// Call the actual handler function with the argument
		GetAllReservationsOfUserHandler(w, r, database)
	})

	http.HandleFunc("/addQuickReservation", func(w http.ResponseWriter, r *http.Request) { // Endpoint to insert a new reservation
        // Call the actual handler function with the argument
        AddQuickReservationHandler(w, r, database)
    })

	http.HandleFunc("/getAllReservationsOfDate", func(w http.ResponseWriter, r *http.Request) { // Endpoint to insert a new reservation
        // Call the actual handler function with the argument
        GetAllReservationOfDateHandler(w, r, database)
    })

	http.HandleFunc("/getAvailableStations", func(w http.ResponseWriter, r *http.Request){
        // Call the actual handler function with the argument
        GetAvailableStations(w, r, database)
    }) // Endpoint voor het ophalen van beschikbare stations op specifieke datum en tijd

	http.HandleFunc("/getQuickReserveStations", func(w http.ResponseWriter, r *http.Request){
        // Call the actual handler function with the argument
        GetLaadpalenQRhandeler(w, r, database)
    }) // Endpoint voor het ophalen van beschikbare stations tussen een specefieke tijd en datum
	
	http.HandleFunc("/AddUser", func(w http.ResponseWriter, r *http.Request) { // Endpoint to insert a new reservation
        // Call the actual handler function with the argument
        AddUser(w, r, database)
    })

	http.HandleFunc("/EditUser", func(w http.ResponseWriter, r *http.Request) { // Endpoint to insert a new reservation
        // Call the actual handler function with the argument
        EditUser(w, r, database)
    })
	http.HandleFunc("/getAllMeldingen", GetAllMeldingenhandler(database)) // Endpoint voor alle meldingen

	http.HandleFunc("/deleteUser", func(w http.ResponseWriter, r *http.Request) {
		DeleteUserHandler(w, r, database)
	})
	http.HandleFunc("/deleteMelding", func(w http.ResponseWriter, r *http.Request) {
		DeleteMeldingHandler(w, r, database)
	})

	fmt.Println("Server is running...")
	// roep priority scheduler aan die altijd runt
	fmt.Println("Starting priority scheduler...")
	go PriorityScheduler(database)
	http.ListenAndServe(":8080", addCorsHeaders(http.DefaultServeMux))
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

func GetAllLaadpalenHandler(database *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get all laadpalen
		laadpalen, err := GetAllLaadpalen(database)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Convert the laadpalen to JSON
		laadpalenJSON, err := json.Marshal(laadpalen)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Send the response back to the client
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(laadpalenJSON)
	}
}

func GetAllUsersHandler(database *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get all laadpalen
		Users, err := GetAllUsers(database)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Convert the laadpalen to JSON
		UserJson, err := json.Marshal(Users)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Send the response back to the client
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(UserJson)
	}
}

func GetAllReservationsOfUserHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	// Decode the JSON request body into a struct
	var requestData struct {
		UserID int `json:"UserID"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Handle the return values from GetAllReservationsOfUser
	reservations, err := GetAllReservationsOfUser(database, requestData.UserID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the reservations to JSON
	reservationsJSON, err := json.Marshal(reservations)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send the response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(reservationsJSON)
}

func GetAllReservationOfDateHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	// Decode the JSON request body into a struct
	var requestData struct {
		Date string `json:"Date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Parse the date string into a time.Time object nu met reuseable method
	date, err := ParseDate(requestData.Date)
	if err != nil {
		http.Error(w, "Invalid date format: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Handle the return values from GetAllReservationOfDate
	reservations, err := GetAllReservationOfDate(database, date)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the reservations to JSON
	reservationsJSON, err := json.Marshal(reservations)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send the response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(reservationsJSON)
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
	// Convert to the "Europe/Amsterdam" time zone
	ceDateTime, err := GetTimeZone(date)
	if err != nil {
		log.Println("Error converting time zone:", err)
		return
	}

	// Insert the reservation into the database
	if err := AddReservation(database, requestData.UserID, requestData.LaadpaalID, ceDateTime, requestData.Priority, requestData.Opgeladen, requestData.Opgehaald); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func AddQuickReservationHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	// Decode the JSON request body into a struct
	var requestData struct {
		UserID     int    `json:"UserID"`
		Date       string `json:"Date"`
		Priority   int    `json:"Priority"`
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

	// Convert to the "Europe/Amsterdam" time zone
	ceDateTime, err := GetTimeZone(date)
	if err != nil {
		log.Println("Error converting time zone:", err)
		return
	}

	// Insert the reservation into the database
	if err := AddQuickReservation(database, requestData.UserID, ceDateTime, requestData.Priority); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func ParseDate(dateStr string) (time.Time, error) {
	const format = time.RFC3339
	date, err := time.Parse(format, dateStr)
	if err != nil {
		return time.Time{}, fmt.Errorf("invalid date format: %s", dateStr)
	}
	return date, nil
}

func GetTimeZone(date time.Time) (time.Time, error) {
	// Load the "Europe/Amsterdam" time zone
	location, err := time.LoadLocation("Europe/Amsterdam")
	if err != nil {
		log.Println("Error loading location:", err)
		return time.Time{}, err
	}

	// Convert the date to the "Europe/Amsterdam" time zone
	ceDateTime := date.In(location)
	return ceDateTime, nil
}