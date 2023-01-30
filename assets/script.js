//PSEUDOCODE
//QUERY URL from API Weather Forecast Geocoding API - get longitude and latitude - DONE
//Get return and store in variables  - DONE
//QUERY URL from API Weather Forecast using longitude and latitude - DONE
//Store in variables
    //Current conditions
        //The city name DONE
        //The date DONE
        //An icon representation of weather conditions 
        //The temperature DONE
        //The humidity DONE
        //The wind speed DONE (maybe convert to kph if needed)
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
        lat + "&lon=" + lon + "&units=metric&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response){
            console.log(response);
            var date = moment(response.list[0].dt_txt).format("DD/MM/YYYY");
            var cityResult = response.city.name;
            var weatherIcon = response.list[0].weather[0].icon;
            console.log(weatherIcon);
            var tempResult = response.list[0].main.temp + "C";
            var windResult = response.list[0].wind.speed;
            var humidityResult = response.list[0].main.humidity;

            updateTodayDisplay(cityResult, date, weatherIcon, tempResult, windResult, humidityResult)
        });
    });
}

// Event listener for Search button element
$("#search-button").on("click", function(event){
    event.preventDefault();
    getWeather();

});

function updateTodayDisplay(cityResult, dateResult, weatherIconResult, tempResult, windResult, humidityResult){
    //Clear the data in the today forecast div in case there is a search from previous
    $("#today").empty();
    var container = $("<div>");
    container.attr("class", "todayContainer")
    var cityHeadline = $("<div>");
    var cityName = $("<h2>");
    var iconURL = "http://openweathermap.org/img/wn/" + weatherIconResult + "@2x.png";
    var iconWeather = $("<img>");
    iconWeather.attr("src", iconURL);
    cityName.html(cityResult + " (" + dateResult + ")");
    cityName.append(iconWeather);
    cityHeadline.append(cityName);
    temp = $("<p>");
    temp.html("Temp: " + tempResult);
    wind = $("<p>");
    wind.html("Wind: " + windResult + "m/s");
    humidity = $("<p>");
    humidity.html("Humidity: " + humidityResult + "%");
    //Append all the elements to div container
    container.append(cityHeadline).append(temp).append(wind).append(humidity);
    //Append container div to today div
    $("#today").append(container);
}
