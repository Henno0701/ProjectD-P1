package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	link := "https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken="
	token := "01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955"
	gegevens := "&url=/poi/v1/locations&method=GET&locationsVisibilityScopes=ACCOUNTS_STATIONS"
	GetApiData(link, token, gegevens)
}

// hier komen de stations dan in
type StationList struct {
	StationList []Station `json:"stationList"`
}

// gegevens van de stations
type Station struct {
	ID      string `json:"id"`
	LocationId string `json:"locationId"`
	Status  string `json:"status"`
	Evses   []struct {
		ID     string `json:"id"`
		Status string `json:"status"`
	} `json:"evses"`
}

func GetApiData(link string, token string, gegevens string) {
	fullURL := link + token + gegevens
	req, err := http.NewRequest("GET", fullURL, nil)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		fmt.Printf("Error: API returned status code %d\n", res.StatusCode)
		return
	}

	// Decode JSON response
	var stationList StationList
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}
	if err := json.Unmarshal(body, &stationList); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return
	}
	var i = 0
	// Print EVSEs
	for _, station := range stationList.StationList {
		fmt.Printf("Station ID: %s, Location ID: %s, Status: %s\n", station.ID, station.LocationId, station.Status)
		fmt.Println("EVSEs:")
		for _, evse := range station.Evses {
			i++
			fmt.Printf("  EVSE ID: %s, Status: %s\n", evse.ID, evse.Status)
		}
		fmt.Println()
	}
	fmt.Println("Aantal EVSEs:", i)
}
