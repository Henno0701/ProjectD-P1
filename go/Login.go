package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type Account struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AccountsResponse struct {
	Accounts []Account `json:"accounts"`
}

func readAccountsFromFile(filePath string) ([]Account, error) {
	// Read the JSON file
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Println("Error reading file:", err)
		return nil, err
	}

	var response AccountsResponse

	// Unmarshal the JSON data
	err = json.Unmarshal(data, &response)
	if err != nil {
		return nil, err
	}

	return response.Accounts, nil
}

func GetAccounts(w http.ResponseWriter, r *http.Request) {
	// Read accounts from JSON file
	accounts, err := readAccountsFromFile("../prototype1/data/Accounts.json")
	if err != nil {
		http.Error(w, "Error reading accounts", http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(accounts)
	if err != nil {
		http.Error(w, "Error encoding accounts to JSON", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Write JSON response
	w.Write(jsonData)
}

type Login struct {
	ID       int            `json:"id"`
	Username string         `json:"username"`
	Email    string         `json:"email"`
	OktaID   sql.NullString `json:"okta_id"`
}

func checkAccounts(db *sql.DB, email string, password string) *Login {
	row := db.QueryRow("SELECT * FROM Users WHERE Email = ? AND Password = ?", email, password)

	// var Id int
	// var Username string
	// var Email string
	var Password string
	// var OktaId sql.NullString

	var user Login

	err := row.Scan(&user.ID, &user.Username, &user.Email, &Password, &user.OktaID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		fmt.Println("Error:", err)
		return nil
	}

	print(user.Email)
	return &user
}

func checkAccountsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")
		password := r.FormValue("password")

		var correct = checkAccounts(db, email, password)
		if correct != nil {

			// Marshal the correct user into JSON format
			userJSON, err := json.Marshal(correct)
			if err != nil {
				// Handle error if JSON marshaling fails
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Set response headers and write the user JSON to the response body

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write(userJSON)
		} else {
			w.WriteHeader(http.StatusNotFound)
		}
	}
}

func selectUser(db *sql.DB, id int) *Login {
	row := db.QueryRow("SELECT * FROM users WHERE ID = ?", (id))

	// var Id int
	// var Username string
	// var Email string
	var Password string
	// var OktaId sql.NullString

	var user Login

	err := row.Scan(&user.ID, &user.Username, &user.Email, &Password, &user.OktaID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		fmt.Println("Error:", err)
		return nil
	}

	return &user
}

func selectUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.URL.Query().Get("ID")
		id, err := strconv.Atoi(idStr)

		if err != nil {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		var correct = selectUser(db, id)
		if correct != nil {

			// Marshal the correct user into JSON format
			userJSON, err := json.Marshal(correct)
			if err != nil {
				// Handle error if JSON marshaling fails
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Set response headers and write the user JSON to the response body

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write(userJSON)
		} else {
			w.WriteHeader(http.StatusNotFound)
		}
	}
}

func getEmailByID(accounts []Account, id string) (string, error) {
	for _, account := range accounts {
		if account.ID == id {
			return account.Email, nil
		}
	}
	return "", fmt.Errorf("user not found")
}

func GetEmailHandler(w http.ResponseWriter, r *http.Request) {
	// Handle CORS preflight request
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := r.URL.Query().Get("id")

	accounts, err := readAccountsFromFile("../prototype1/data/Accounts.json")
	if err != nil {
		http.Error(w, "Error reading accounts", http.StatusInternalServerError)
		return
	}

	email, err := getEmailByID(accounts, userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(map[string]string{"email": email})
}
