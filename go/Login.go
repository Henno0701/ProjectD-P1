package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

// Account represents the structure of each account in the JSON file
type Account struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	// Add more fields as needed
}

// AccountsResponse represents the structure of the JSON response
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
	log.Println("JSON data:", string(data))

	// Define a variable of type AccountsResponse to store the JSON data
	var response AccountsResponse

	// Unmarshal the JSON data into the response variable
	err = json.Unmarshal(data, &response)
	if err != nil {
		return nil, err
	}

	return response.Accounts, nil
}

func GetAccounts(w http.ResponseWriter, r *http.Request) {
	// Read accounts from JSON file
	accounts, err := readAccountsFromFile("Accounts.json")
	if err != nil {
		http.Error(w, "Error reading accounts", http.StatusInternalServerError)
		return
	}

	// Convert accounts slice to JSON
	jsonData, err := json.Marshal(accounts)
	if err != nil {
		http.Error(w, "Error encoding accounts to JSON", http.StatusInternalServerError)
		return
	}

	// Set response content type
	w.Header().Set("Content-Type", "application/json")

	// Write JSON response
	w.Write(jsonData)
}
