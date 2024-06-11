package main

import (
	"database/sql"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCheckAccounts(t *testing.T) {
	// Initialize mock database (you'll need to implement this)
	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer db.Close()

	// Test case: valid user
	if checkAccounts(db, "Henk@gmail.com", "HenkPassword") == nil {
		t.Error("Expected true, got false for valid user")
	}

	// Test case: invalid user
	if checkAccounts(db, "invalid@example.com", "password") != nil {
		t.Error("Expected false, got true for invalid user")
	}
}
func TestLinkOktaIdHandler(t *testing.T) {
	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer db.Close()

	handler := LinkOktaIdHandler(db)

	// Create a test HTTP request
	req := httptest.NewRequest("POST", "/link-okta-id?id=1&oktaId=oktaID123", nil)
	w := httptest.NewRecorder()

	// Call the handler function
	handler(w, req)

	// Check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("LinkOktaIdHandler() status code = %v, want %v", w.Code, http.StatusOK)
	}

	// Check the response body
	expectedBody := `{"message":"User OktaId updated successfully"}`
	if strings.TrimSpace(w.Body.String()) != expectedBody {
		t.Errorf("LinkOktaIdHandler() body = %v, want %v", w.Body.String(), expectedBody)
	}
}

func TestCheckAccountsHandler(t *testing.T) {
	// Initialize mock database (you'll need to implement this)
	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer db.Close()

	// Create mock HTTP request
	req, err := http.NewRequest("POST", "/checkAccounts", nil)
	if err != nil {
		t.Fatal(err)
	}
	// Set form values for email and password
	req.Form = map[string][]string{
		"email":    {"Henk@gmail.com"},
		"password": {"HenkPassword"},
	}

	// Create HTTP test recorder
	rr := httptest.NewRecorder()

	// Call handler function
	handler := checkAccountsHandler(db)
	handler.ServeHTTP(rr, req)

	// Check response status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, rr.Code)
	}
}
