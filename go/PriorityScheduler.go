package main

import (
    "database/sql"
    "fmt"
    "time"
    "log"
)

type Reservering struct {
    id         int
    UserID     int
    Date       time.Time
    Priority   int
}

func PriorityScheduler(db *sql.DB) {
    for {
        now := time.Now()
        if now.Hour() >= 6 && now.Hour() <= 21 {
            fmt.Printf("It is %02d:00 hour\n", now.Hour())
            Indelen(db, now)
        } else {
            fmt.Println("It's closing time, check manually if there is any car occupied.")
            fmt.Println("Current date and time (RFC3339):", now.Format(time.RFC3339))
        }
        time.Sleep(20 * time.Second)
    }
}

func Indelen(db *sql.DB, date time.Time) {
    dateNextHour := GetNextHour(date)
    // zet date terug naar laagste uur so 12:36 -> 12:00
    date = date.Add(-time.Minute * time.Duration(date.Minute()))

    laadpalen, err := GetAllLaadpalen(db)
    if err != nil {
        log.Println("Error retrieving laadpalen: " + err.Error())
        return
    }
    // var i = 0
    // for _, laadpaal := range laadpalen {
    //     fmt.Println("Laadpaal ID:", laadpaal.ID, "Status:", laadpaal.Status)
    //     i++
    // }
    // log.Println("Aantal laadpalen: ", i)

    query := "SELECT * FROM QuickReserveReservations WHERE Date >= ? AND Date < ?"
    rows, err := db.Query(query, date, dateNextHour)
    log.Println(date.Format(time.RFC3339), dateNextHour.Format(time.RFC3339))   
    if err != nil {
        log.Println("Error querying database: " + err.Error())
        return
    }
    defer rows.Close()
    
    // Initialize the priority slices
    Prio0 := []Reservering{}
    Prio1 := []Reservering{}
    Prio2 := []Reservering{}
    Prio3 := []Reservering{}
    Prio4 := []Reservering{}
    
    fmt.Println("we gaan nu verdelen")
    
    for rows.Next() {
        log.Println("Scanning row")
        var r Reservering
        if err := rows.Scan(&r.id, &r.UserID, &r.Date, &r.Priority); err != nil {
            log.Println("Error scanning row: " + err.Error())
            return
        }
        fmt.Println("UserID:", r.UserID, "Date:", r.Date, "Priority:", r.Priority)
        switch r.Priority {
        case 0:
            Prio0 = append(Prio0, r)
        case 1:
            Prio1 = append(Prio1, r)
        case 2:
            Prio2 = append(Prio2, r)
        case 3:
            Prio3 = append(Prio3, r)
        case 4:
            Prio4 = append(Prio4, r)
        }
    }
    
    // Check for any error that occurred during iteration
    if err = rows.Err(); err != nil {
        log.Println("Error iterating rows: " + err.Error())
        return
    }

    busyLaadpalenIDs, err := GetBusyLaadpalen(db, date, dateNextHour)
    if err != nil {
        log.Println("Error querying busy laadpalen: " + err.Error())
        return
    }
    for _, id := range busyLaadpalenIDs {
        fmt.Println("Busy laadpaal ID:", id)
    }

    filteredLaadpalen := FilterLaadpalen(laadpalen, busyLaadpalenIDs)
    aantal := len(filteredLaadpalen)

    for i := 0; i < aantal; i++ {
        if len(Prio4) > 0 {
            userid := Prio4[0].UserID
            laadpaalid := filteredLaadpalen[i].ID
            date := Prio4[0].Date
            priority := Prio4[0].Priority
            laadpaal := filteredLaadpalen[i]
            Quickreserveadd(db, userid, laadpaalid, date, priority, laadpaal)
            Prio4 = Prio4[1:]
        } else if len(Prio3) > 0 {
            userid := Prio3[0].UserID
            laadpaalid := filteredLaadpalen[i].ID
            date := Prio3[0].Date
            priority := Prio3[0].Priority
            laadpaal := filteredLaadpalen[i]
            Quickreserveadd(db, userid, laadpaalid, date, priority, laadpaal)
            Prio3 = Prio3[1:]
        } else if len(Prio2) > 0 {
            userid := Prio2[0].UserID
            laadpaalid := filteredLaadpalen[i].ID
            date := Prio2[0].Date
            priority := Prio2[0].Priority
            laadpaal := filteredLaadpalen[i]
            Quickreserveadd(db, userid, laadpaalid, date, priority, laadpaal)
            Prio2 = Prio2[1:]
        } else if len(Prio1) > 0 {
            userid := Prio1[0].UserID
            laadpaalid := filteredLaadpalen[i].ID
            date := Prio1[0].Date
            priority := Prio1[0].Priority
            laadpaal := filteredLaadpalen[i]
            Quickreserveadd(db, userid, laadpaalid, date, priority, laadpaal)
            Prio1 = Prio1[1:]
        } else if len(Prio0) > 0 {
            userid := Prio0[0].UserID
            laadpaalid := filteredLaadpalen[i].ID
            date := Prio0[0].Date
            priority := Prio0[0].Priority
            laadpaal := filteredLaadpalen[i]
            Quickreserveadd(db, userid, laadpaalid, date, priority, laadpaal)
            Prio0 = Prio0[1:]
        }
        // indien alle laadpalen vol zijn word er nog niks gedaan met de overgebleven users
    }

    fmt.Println("Laadpalen zijn ingedeeld voor de tijdslot: ", date.Format(time.RFC3339), " tot ", dateNextHour.Format(time.RFC3339))
}

func Quickreserveadd(db *sql.DB, userID int, laadpaalID int, date time.Time, priority int, laadpaal Laadpaal) {
    query := "INSERT INTO Reservations (UserID, LaadpaalID, Date, Priority, Opgeladen, Opgehaald) VALUES (?, ?, ?, ?, ?, ?)"
    _, err := db.Exec(query, userID, laadpaalID, date, priority, 0, 0)
    if err != nil {
        log.Println("Error adding reservation: " + err.Error())
    }
    // zodra toegevoegd wel verwijderen
    _, err = db.Exec("DELETE FROM QuickReserveReservations WHERE UserID = ? AND Date = ? AND Priority = ?", userID, date, priority)
    if err != nil {
        log.Println("Error deleting quick reservation: " + err.Error())
    }
}