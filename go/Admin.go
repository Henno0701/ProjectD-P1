package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"fmt"
	"strconv"
)

type Melding struct {
	ID   int    `json:"id"`
	User_id int `json:"user_id"`
	Type_Melding string `json:"text"`
	DateOfNotification string `json:"date"`
}


// alle methods/functies die te maken hebben met de Admin
func AddUser(db *sql.DB, voornaam string, achternaam string, adress string, telefoonnummer string, postcode string, provincie string, automodel string, autocapaciteit string, email string, wachtwoord string) error {
	queryInsertMedewerker := "INSERT INTO Medewerkers (Voornaam, Achternaam, Email, Adress, TelefoonNummer, PostCode, Provincie, AutoModel, AutoCapaciteit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
	queryInsertUser := "INSERT INTO Users (ID, Username, Email, Password) VALUES (?, ?, ?, ?)"

	// Insert Medewerker
	_, err := db.Exec(queryInsertMedewerker, voornaam, achternaam, email, adress, telefoonnummer, postcode, provincie, automodel, autocapaciteit)
	if err != nil {
		return err
	}

	// Insert User
	_, err = db.Exec(queryInsertUser, 1, voornaam, email, wachtwoord)
	if err != nil {
		return err
	}

	return nil
}

func EditUser(w http.ResponseWriter, r *http.Request, db *sql.DB){
	queryUpdateMedewerker := "UPDATE Medewerkers SET Voornaam = ?, Achternaam = ?, Adress = ?, TelefoonNummer = ?, PostCode = ?, Provincie = ?, AutoModel = ?, AutoCapaciteit = ? WHERE ID = ?"
	queryUpdateUser := "UPDATE Users SET Username = ?, Email = ?, Password = ? WHERE ID = ?"

	// decode json
	var requestData struct {	
		Voornaam 		string `json:"voornaam"`
		Achternaam 		string `json:"achternaam"`
		Adress 			string `json:"adress"`
		TelefoonNummer 	string `json:"telefoonnummer"`
		PostCode 		string `json:"postcode"`
		Provincie 		string `json:"provincie"`
		AutoModel 		string `json:"automodel"`
		AutoCapaciteit 	string `json:"autocapaciteit"`
		Email 			string `json:"email"`
		Wachtwoord 		string `json:"wachtwoord"`
		ID 				int `json:"id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tx, err := db.Begin()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Update Medewerkers
	_, err = tx.Exec(queryUpdateMedewerker, requestData.Voornaam, requestData.Achternaam, requestData.Adress, requestData.TelefoonNummer, requestData.PostCode, requestData.Provincie, requestData.AutoModel, requestData.AutoCapaciteit, requestData.ID)
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Update Users
	_, err = tx.Exec(queryUpdateUser, requestData.Voornaam, requestData.Email, requestData.Wachtwoord, requestData.ID)
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Commit alles
	err = tx.Commit()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func DeleteUser(db *sql.DB, id int) error {
	queryDeleteMedewerker := "DELETE FROM Medewerkers WHERE id = ?"
	queryDeleteUser := "DELETE FROM Users WHERE ID = ?"

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// Delete Medewerker
	_, err = tx.Exec(queryDeleteMedewerker, id)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Delete User
	_, err = tx.Exec(queryDeleteUser, id)
	if err != nil {
		tx.Rollback()
		return err
	}

	// HEEL BELANGRIJK verwijder reserveringen van de user
	_, err = tx.Exec("DELETE FROM Reservations WHERE UserID = ?", id)
	if err != nil {
		tx.Rollback()
		return err
	}
	_, err = tx.Exec("DELETE FROM QuickReserveReservations WHERE UserID = ?", id)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Commit alles
	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

// Get all meldingen
func GetAllMeldingen(db *sql.DB) ([]Melding, error) {
	rows, err := db.Query("SELECT ID, UserID, Melding, DateOfNotification FROM Meldingen ORDER BY DateOfNotification DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var meldingen []Melding
	for rows.Next() {
		var melding Melding
		if err := rows.Scan(&melding.ID, &melding.User_id, &melding.Type_Melding, &melding.DateOfNotification); err != nil {
			return nil, err
		}
		meldingen = append(meldingen, melding)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return meldingen, nil
}

func DeleteMelding(db *sql.DB, id int) error {
	_, err := db.Exec("DELETE FROM Meldingen WHERE ID = ?", id)
	return err
}

// Handlers voor de delete methods
func DeleteUserHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// Decode the JSON request body into a struct
	var requestData struct {
		UserID int `json:"UserID"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(requestData.UserID)

	// Delete the user from the database
	if err := DeleteUser(db, requestData.UserID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

// Handler to delete a melding
func DeleteMeldingHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// Parse the melding ID from the URL query parameters
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing melding ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid melding ID", http.StatusBadRequest)
		return
	}

	// Delete the melding from the database
	if err := DeleteMelding(db, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func GetAllMeldingenhandler(db *sql.DB) http.HandlerFunc{
	return func(w http.ResponseWriter, r *http.Request) {
		meldingen, err := GetAllMeldingen(db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Encode the meldingen into JSON and write to response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(meldingen)
	}
}