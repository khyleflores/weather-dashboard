//PSEUDOCODE
//QUERY URL from API Weather Forecast Geocoding API - get longitude and latitude
//Get return and store in variables 
//QUERY URL from API Weather Forecast using longitude and latitude
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


//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


// Grabbing and storing the data-animal property value from the button
var city= $("#search-input").val();
var lat;
var lon;

// Constructing a queryURL using the city name
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" +
lat + "&lon=" + lon + "&appid=a3870bc5f9f6b6036fee3bdf6b81ac04";