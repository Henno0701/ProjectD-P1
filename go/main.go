package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "sync"
)

var (
    nameStore string
    mu        sync.Mutex // Mutex for synchronizing access to nameStore
)

func main() {
    http.HandleFunc("/getName", getNameHandler)   // Endpoint to get the name
    http.HandleFunc("/setName", setNameHandler)   // Endpoint to set the name
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