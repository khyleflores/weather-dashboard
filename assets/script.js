var city = "";
// Array where the localstorage details will be stored
var searchedCities = [];

$(window).on("load", function(event){
    event.preventDefault();
    addSearchHistoryButtons()
});

function getWeather(city){
    // Constructing a queryURL using the city name to get coordinates
    var queryURLCoord = "http://api.openweathermap.org/geo/1.0/direct?q=" + 
    city + "&limit=1&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

    $.ajax({
        url: queryURLCoord,
        method: "GET"
    })
    .then(function(response){
        //set the result of lat and lon from Ajax to variables to use to queryURL
        var lat = response[0].lat;
        var lon = response[0].lon;

        // Constructing a queryURL using the coordinates from variable lat and lan
        var queryURLToday = "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat + "&lon=" + lon + "&units=metric&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

        //Another Ajax call to get the weather for 5 days
        $.ajax({
            url: queryURLToday,
            method: "GET"
        })
        .then(function(response){
            var date = moment().format("DD/MM/YYYY");
            //get the response and store in variables
            var cityResult = response.name;
            var weatherIcon = response.weather[0].icon;
            var tempResult = response.main.temp + "	&#186;C";
            var windResult = response.wind.speed;
            var humidityResult = response.main.humidity;
            
            //use the set variables to update the HTML with information
            updateTodayDisplay(cityResult, date, weatherIcon, tempResult, windResult, humidityResult)
            
            // Constructing a queryURL using the coordinates from variable lat and lan
            var queryURL5Day = "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            lat + "&lon=" + lon + "&units=metric&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";

            //Another Ajax call to get the weather for 5 days
            $.ajax({
                url: queryURL5Day,
                method: "GET"
            })
            //get the response and store in variables
            .then(function(response){
                var forecastTitle = $("<h3>");
                //id to h3 element
                forecastTitle.attr("id", "forecastTitle")
                forecastTitle.html("5-Day Forecast:");
                //append h3 element to div with id forecast
                $("#forecast").append(forecastTitle);
                //For loop to store responses and pass it in function
                for (let i = 0; i < response.list.length; i++) {
                    var midDay = moment(response.list[i].dt_txt).format("HH:mm:ss"); 
                    if (midDay == "12:00:00"){
                        var date = moment(response.list[i].dt_txt).format("DD/MM/YYYY");
                        var weatherIcon = response.list[i].weather[0].icon;
                        var tempResult = response.list[i].main.temp + "&#186;C";
                        var windResult = response.list[i].wind.speed;
                        var humidityResult = response.list[i].main.humidity;
                        fiveDayForecast(date, weatherIcon, tempResult, windResult, humidityResult);
                    }
                }
            });
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
        alert("Please enter a city in the search textbox.");
        $("#history").empty();
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
    // remove duplicated data using Set constructor
    var searchedCitiesUniq = [...new Set(searchedCities)];
    //Set the records in local storage with searchedCitiesUnic array
    //This was there is no duplicate on search history buttons and local storage
    localStorage.setItem("searches", JSON.stringify(searchedCitiesUniq));
    //If the array is not null then add buttons for each data in the array
    if (searchedCitiesUniq !== null) {
        //for loop for each array of searchCities - create a button and append to div history
        for (let i = 0; i < searchedCitiesUniq.length; i++) {
            var button = $("<button>");
            button.addClass("btn btn-secondary historyButtons");
            button.text(searchedCitiesUniq[i]);
            $("#history").append(button);
        }
    }
}

// Event listener for Search button element
$("#search-button").on("click", function(event){
    event.preventDefault();
    // Grabbing and storing the search input value 
    city= $("#search-input").val();
    //Clear the data in the forecast div in case there data from previous search
    $("#forecast").empty();
    getWeather(city);
    addToSearchHistory();
    addSearchHistoryButtons();
});

// Event listener for history button element
$("#history").on("click", ".historyButtons", function(event){
    event.preventDefault();
    //set the searchCity variable to the text of the button clicked
    var searchCity = $(this).text();
    //Clear the data in the forecast div in case there data from previous search
    $("#forecast").empty();
    //call getWeather function with parameter searchCity
    getWeather(searchCity);
})

function fiveDayForecast(date, weatherIconResult, tempResult, windResult, humidityResult){
    //Add elements in the div class with this container div
    var container = $("<div>");
    container.attr("class", "forecastContainer");
    var dateForecast = $("<h4>");
    dateForecast.html(date);
    // icon url is equal to this source but will change depending on the AJAX response - icon
    var iconURL = "http://openweathermap.org/img/wn/" + weatherIconResult + "@2x.png";
    // Add image element for the icon
    var iconWeather = $("<img>");
    // set the img src to the iconURL
    iconWeather.attr("src", iconURL);
    temp = $("<p>");
    temp.html("Temp: " + tempResult);
    wind = $("<p>");
    wind.html("Wind: " + windResult + "m/s");
    humidity = $("<p>");
    humidity.html("Humidity: " + humidityResult + "%");
    //Append all the elements to div container
    container.append(dateForecast).append(iconWeather).append(temp).append(wind).append(humidity);
    //Append container div to today div
    $("#forecast").append(container);
}