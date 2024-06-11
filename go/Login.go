package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

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

type User struct {
	ID       int            `json:"id"`
	Username string         `json:"username"`
	Email    string         `json:"email"`
	OktaID   sql.NullString `json:"okta_id"`
}

func checkAccounts(db *sql.DB, email string, password string) *User {
	row := db.QueryRow("SELECT * FROM Users WHERE Email = ? AND Password = ?", email, password)

	// var Id int
	// var Username string
	// var Email string
	var Password string
	// var OktaId sql.NullString

	var user User

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
