//First I need to create the divs for each section of weather information. There will be a header at the top of the page that doesn't need any sort of interaction. My first goal will be to get a single location to show the current weather. Then I'll move on to having the 5-Day forcast display. THEN I'll work on the city search bar and how that interacts with the weather being displayed. 

//always start with document ready
$(document).ready(function () {

    //Global Scope
    //Open Weather API Key
    var apiKey = "fcef441d33f4bca0db59188a9ba59398";

    //On click event for city values that have been appended onto the page.
    $('.history').on('click', function() {
        console.log('clicked history', $(this).text())
        getMainWeather($(this).text())
    })

    //On click event for the main search bar
    $("#select-city").on("click", function (e) {
        e.preventDefault()
        getMainWeather($("#city-input").val())
        //append the history! each button will have a class of history
        //Odd issue happening here, buttons keep prepending inside of themselves. Gotta work on this.
        //123
        //1 Create an html element with jquery
        var cityHistory = $("<button>");

        //2 dress it up
        cityHistory.addClass("history");
        cityHistory.text($("#city-input").val());

        //3 append it to the page
        $(".history").prepend(cityHistory);

    })

    //Retrieving the main up to date weather info from the API.
    function getMainWeather(city) {
        var userInput = city
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + apiKey + "&units=imperial";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //Punching the API value into the empty HTML elements with jquery
            $("#city-name").text(response.name + " " + moment().format('MMMM Do YYYY'));
            $("#temp").text("Temperature " + response.main.temp + "℉");
            $("#humid").text("Humidity " + response.main.humidity + "%");
            $("#wind-speed").text("Wind Speed " + response.wind.speed + "MPH");
            //Call the getUV function
            getUv(response.coord.lon, response.coord.lat)
        })
    }

    //The UV requires a seperate API link. This function allows the data to be called in the main weather function without taking up extra space.
    function getUv(lon,lat) {
        
        var uvQueryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey

        $.ajax({
            url: uvQueryUrl,
            method: "GET"
        }).then(function (response) {
            $("#uv-index").text("UV Index " + response.value)
            //Call the fiveDay function
            fiveDay(response.coord.lon, response.coord.lat)
        })
    }

    // The future weather data requires a seperate API link. This function allows the data to be called in the main weather function without taking up extra space. Having trouble getting the lon to read properly.
    function fiveDay(lon,lat) {
        console.log('time to get 5day stuff!!!');
        //USE THIS MAYBE??
        
        var fiveDayQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=&appid=${apiKey}`;
        console.log(fiveDayQueryUrl);

        $.ajax({
            url: fiveDayQueryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $("#five-day").text(response)
        })

    }


});









//By city name
// You can search weather forecast for 5 days with data every 3 hours by city name. All weather data can be obtained in JSON and XML formats.
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

// Call current UV data By geographic coordinates
// ("http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}")