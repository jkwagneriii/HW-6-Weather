// OPEN WEATHER API 
var APIKey = "fcef441d33f4bca0db59188a9ba59398"; 

// MUST USE lat and lon FOR UV API
function UvIndex(lat, lon){
    var queryURLUVIndex = "https://api.openweathermap.org/data/2.5/uvi?&appid=e79e860f1526eb9cc2572046fff7a30c&lat=" + lat  + "&lon=" + lon;

    $.ajax({
        url:queryURLUVIndex,
        method: "GET"
    }).then(function (response) {
        uvBackground(response.value)
    });
};

// SWITCH FOR UV COLOR
function uvBackground(uvRes) {
    $("#uv-index-results").text(uvRes);
    switch (
        true
    ) {
        case (1 < uvRes && uvRes < 2):
            $("#uv-index-results").css("background-color", "green");
            break;
        case (3 < uvRes && uvRes < 5):
            $("#uv-index-results").css("background-color", "yellow");
            break;
        case (6 < uvRes && uvRes < 7):
            $("#uv-index-results").css("background-color", "orange");
            break;
        case (8 < uvRes && uvRes < 10):
            $("#uv-index-results").css("background-color", "red");
            break;
        case (10 < uvRes):
            $("#uv-index-results").css("background-color", "purple");
            break;
    };
};

function getForecast(userInput){
    var queryURLForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&appid=" + APIKey;

    $.ajax({
        url: queryURLForecast,
        method: "GET"
    }).then(function(response) {
        for(var i =0; i< response.list.length; i++) {
            // CREATE 
            var dayContainer = $('<div>')
            var rawDate = response.list[i].dt_txt;
            var splitForecastDate = rawDate.split(" ");

            if(splitForecastDate[1] === '09:00:00') {
                // ATTRIBUTES
                var forecastDate = moment(splitForecastDate[0]).format("MM/DD/YYYY");
                dayContainer.addClass('col-2 forecast')
                var forecastWeatherIcon = response.list[i].weather[0].icon;
                var forecastIconURL = "http://openweathermap.org/img/w/" + forecastWeatherIcon + ".png";
                forecastIconEl = $("<img>").attr("src", forecastIconURL);
    
                var forecastTempK = response.list[i].main.temp;
                var forecastTempC = (forecastTempK - 273.15)*1.80+32;
                var forecastHum = response.list[i].main.humidity;
                var day = i + 1
    
                // APPEND
                $("#forecast-day-" + day).append(forecastDate);
                $("#forecast-day-" + day).append(forecastIconEl);
                $("#forecast-day-" + day).append("<p>" + "Temperature: " + forecastTempC.toFixed(2) + " °F");
                $("#forecast-day-" + day).append("<p>" + "Humidity: " + forecastHum + "%")
    
                dayContainer.append(
                    forecastDate,
                    forecastIconEl,
                    "<p>" + "Temperature: " + forecastTempC.toFixed(2) + " °F", 
                    "<p>" + "Humidity: " + forecastHum + "%"
                )
                $('.day-rows').append(dayContainer)
            };
        };
    });
};

function searchWeather(name) {

    var userInput = name
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ userInput+"&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        $("#city-name").empty();
        $("#uv-index-results").empty();
        $(".day-rows").empty();

        // CURRENT WEATHER
        var cityName = $("<div>").text(response.name); 
        var weatherIcon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
        iconEl = $("<img>").attr("src", iconURL);
        var tempK = response.main.temp;
        var tempC = (tempK - 273.15)*1.80+32;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;

        // APPEND 
        $("#city-name").empty(); 
        $("#city-name").append(cityName); 
        $(cityName).addClass("city-name-style");
        $(cityName).append(iconEl);
        $("#city-name").append("<p>" + "Temperature: " + tempC.toFixed(2) + " °F");
        $("#city-name").append("<p>" + "Humidity: " + humidity + " %");
        $("#city-name").append("<p>" + "Wind Speed: " + windSpeed + " MPH");

       // MUST USE lat and lon RESPONSE FOR UV
        lat = response.coord.lat;
        lon = response.coord.lon;     
        UvIndex(lat, lon)
        getForecast(userInput)
    });
    //LOCAL STORAGE
    localStorage.setItem("userChoice", userInput);
    var storedUserAnswer = localStorage.getItem("userChoice");
    $("#past-searches").append("<p class='history'>" + storedUserAnswer + "</p>");
};

// CURRENT WEATHER
$("#select-city").on("click", function(event) { 
    event.preventDefault();
    var inputCity = $("#city-input").val().trim();
    searchWeather(inputCity);
});

// SEARCH PREVIOUS CITIES
$(document).on('click', '.history', function() {
    event.preventDefault();
    var inputCity = $(this).text().trim();
    searchWeather(inputCity);
});