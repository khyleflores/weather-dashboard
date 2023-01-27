//PSEUDOCODE
//QUERY URL from API Weather Forecast Geocoding API - get longitude and latitude - DONE
//Get return and store in variables  - DONE
//QUERY URL from API Weather Forecast using longitude and latitude - DONE
//Store in variables
    //Current conditions
        //The city name
        //The date
        //An icon representation of weather conditions
        //The temperature
        //The humidity
        //The wind speed
    //Future conditions - 5days
        //The date
        //An icon representation of weather conditions
        //The temperature
        //The humidity
//Local storage information of past search
//Create buttons for search history - for loop to number of searches stored in local storage

var cityName;
var date;
var weatherIcon;
var temp;
var humidity;
var windSpeed;



function getWeather(){
    // Grabbing and storing the search input value 
    var city= $("#search-input").val();
    // Constructing a queryURL using the city name to get coordinates
    var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + 
    city + "&limit=1&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        console.log(response);

        var lat = response[0].lat;
        var lon = response[0].lon;

        console.log(lat + " " + lon);

        // Constructing a queryURL using the city name
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat + "&lon=" + lon + "&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response){
            console.log(response);

            var container = $("<div>");
            cityName = $("<h2>");
            cityName.html(response.city.name);
            temp = $("<p>");
            temp.html("Temp: " + parseFloat((response.list[0].main.temp - 273.15).toFixed(2)));
            wind = $("<p>");
            wind.html("Wind: " + response.list[0].wind.speed + "m/s");
            humidity = $("<p>");
            humidity.html("Humidity: " + response.list[0].main.humidity + "%");
            container.append(cityName).append(temp).append(wind).append(humidity);
            $("#today").append(container);

            
        });
    });
}

// Event listener for Search button element
$("#search-button").on("click", function(event){
    event.preventDefault();
    getWeather();

});

function updateTodayDisplay(){
    
}

function calculateCelsius(temperature){

}