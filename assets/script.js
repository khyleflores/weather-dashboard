//PSEUDOCODE
//QUERY URL from API Weather Forecast Geocoding API - get longitude and latitude - DONE
//Get return and store in variables  - DONE
//QUERY URL from API Weather Forecast using longitude and latitude - DONE
//Store in variables
    //Current conditions
        //The city name DONE
        //The date DONE
        //An icon representation of weather conditions  DONE
        //The temperature DONE
        //The humidity DONE
        //The wind speed DONE (maybe convert to kph if needed)
    //Future conditions - 5days
        //The date
        //An icon representation of weather conditions
        //The temperature
        //The humidity
//Local storage information of past search - DONE
//Create buttons for search history - for loop to number of searches stored in local storage - DONE

var city = "";
// Array where the localstorage details will be stored
var searchedCities = [];

$(window).on("load", function(event){
    event.preventDefault();
    addSearchHistoryButtons()
    
});


function getWeather(city){
    
    // Constructing a queryURL using the city name to get coordinates
    var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + 
    city + "&limit=1&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        console.log(response);

        //set the result of lat and lon from Ajax to variables to use to queryURL
        var lat = response[0].lat;
        var lon = response[0].lon;

        // Constructing a queryURL using the coordinates from variable lat and lan
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat + "&lon=" + lon + "&units=metric&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

        //Another Ajax call to get the weather for 5 days
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response){
            console.log(response);
            //get the response and store in variables
            var date = moment(response.list[0].dt_txt).format("DD/MM/YYYY");
            var cityResult = response.city.name;
            var weatherIcon = response.list[0].weather[0].icon;
            console.log(weatherIcon);
            var tempResult = response.list[0].main.temp + "C";
            var windResult = response.list[0].wind.speed;
            var humidityResult = response.list[0].main.humidity;

            //use the set variables to update the HTML with information
            updateTodayDisplay(cityResult, date, weatherIcon, tempResult, windResult, humidityResult)
        });
    });
}

function updateTodayDisplay(cityResult, dateResult, weatherIconResult, tempResult, windResult, humidityResult){
    //Clear the data in the today forecast div in case there is a search from previous
    $("#today").empty();
    //Add elements in the div class today with this container div
    var container = $("<div>");
    container.attr("class", "todayContainer")
    var cityHeadline = $("<div>");
    var cityName = $("<h2>");
    // icon url is equal to this source but will change depending on the AJAX response - icon
    var iconURL = "http://openweathermap.org/img/wn/" + weatherIconResult + "@2x.png";
    // Add image element for the icon
    var iconWeather = $("<img>");
    // set the img src to the iconURL
    iconWeather.attr("src", iconURL);
    cityName.html(cityResult + " (" + dateResult + ")");
    //Append the img to h2 element - cityName
    cityName.append(iconWeather);
    //Append the h2 element to the div cityHeadline
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

function addToSearchHistory(){
    if(!city){
        //Do this if var city is empty
    }
    else{
        searchedCities = [];
        $("#history").empty();
        //If there is a records detail in local storage then assign that to HighScoresRecord array
        if (localStorage.getItem("searches") !== null) {
            searchedCities = JSON.parse(localStorage.getItem("searches"));
        }
        //Pushing new city searchedCities array to store before setting it to local storage
        searchedCities.push(city);
        //Set the records in local storage with searchedCities array
        localStorage.setItem("searches", JSON.stringify(searchedCities));
    }
}

//function for add search history buttons
function addSearchHistoryButtons(){
    //set this variable array from data of local storage
    searchedCities = JSON.parse(localStorage.getItem("searches"));
    //If the array is not null then add buttons for each data in the array
    if (searchedCities !== null) {
        //for loop for each array of searchCities - create a button and append to div history
        for (let i = 0; i < searchedCities.length; i++) {
            var button = $("<button>");
            button.addClass("btn btn-secondary historyButtons");
            button.text(searchedCities[i]);
            $("#history").append(button);
        }
    }
}

// Event listener for Search button element
$("#search-button").on("click", function(event){
    event.preventDefault();
    // Grabbing and storing the search input value 
    city= $("#search-input").val();
    getWeather(city);
    addToSearchHistory();
    addSearchHistoryButtons();
});

// Event listener for history button element
$("#history").on("click", ".historyButtons", function(event){
    event.preventDefault();
    //set the searchCity variable to the text of the button clicked
    var searchCity = $(this).text();
    //call getWeather function with parameter searchCity
    getWeather(searchCity);
})

