package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
	"encoding/json"
    "bytes"
)

func main() {
    link := "https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken="
    token := "01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955"
    gegevens := "&url=/poi/v1/locations&method=GET&locationsVisibilityScopes=ACCOUNTS_STATIONS"
    GetApiData(link, token, gegevens)
}

func GetApiData(link string, token string, gegevens string) {
    fullURL := link + token + gegevens
    req, err := http.NewRequest("GET", fullURL, nil)
    if err != nil {
        fmt.Print(err.Error())
        return
    }
    // hoeft niet per se maar is handig voor als je met een API werkt met go
    req.Header.Add("x-rapidapi-key", token)
    
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        fmt.Print(err.Error())
        return
    }
    defer res.Body.Close()
    
    if res.StatusCode != http.StatusOK {
        fmt.Printf("Error: API returned status code %d\n", res.StatusCode)
        return
    }
    
    body, readErr := ioutil.ReadAll(res.Body)
    if readErr != nil {
        fmt.Print(readErr.Error())
        return
    }

    // Pretty print JSON 
    prettyJSON := jsonPrettyPrint(string(body))
    fmt.Println(prettyJSON)
}

// zodat data mooit uitleesbaar word in de console (voor nu, word later gemerged met een method die de data omzet in een file of die de data afsplit in methods die dat in een database zet)
func jsonPrettyPrint(in string) string {
    var out bytes.Buffer
    err := json.Indent(&out, []byte(in), "", "\t")
    if err != nil {
        return in
    }
    return out.String()
}
