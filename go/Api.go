package main

import(
    "net/http"
    "fmt"
    "io/ioutil"
)


func main() {
	url := "https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel?distance=100&vehicle=SmallDieselCar"
	GetApiData(url)
}

func GetApiData(url string){
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        fmt.Print(err.Error())
    }
    req.Header.Add("x-rapidapi-key", "YOU_API_KEY")
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        fmt.Print(err.Error())
    }
    defer res.Body.Close()
    body, readErr := ioutil.ReadAll(res.Body)
    if readErr != nil {
        fmt.Print(err.Error())
    }
    fmt.Println(string(body))
}