package main

import (	
	"database/sql"	
	"fmt"
	"strconv"
	"time"
)

// alle methods/functies die te maken hebben met de database
func Maketables(db *sql.DB) error {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS Users (ID INTEGER PRIMARY KEY, Username VARCHAR(255), Email VARCHAR(255), Password VARCHAR(255))")
	_, err = db.Exec(
		"CREATE TABLE IF NOT EXISTS Reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, LaadpaalID INTEGER, Date DATETIME, Priority INTEGER, Opgeladen BOOLEAN, Opgehaald BOOLEAN)")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS Medewerkers (id INTEGER PRIMARY KEY AUTOINCREMENT, Voornaam VARCHAR(255), Achternaam VARCHAR(255), Email VARCHAR(255), Adress VARCHAR(255), TelefoonNummer VARCHAR(255), PostCode VARCHAR(255), Provincie VARCHAR(255), AutoModel VARCHAR(255), AutoCapaciteit VARCHAR(255));")
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