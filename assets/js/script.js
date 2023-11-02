// Use jquery to get elements from the page
var formEl = $('#city-form');
var cityEl = $('input[name="city"]').css("text-transform", "capitalize");
var currentEl = $('#current');
var citySearchEl = $('#city-search')

// function that takes in latitude and longitude to display current weather and 5-day forecast
function displayForecast(lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=a3b8266a3ce273e91f4876eaa66f854a')
    .then(function (response) {
        return(response.json());
    })
    .then(function (data) {

        // current weather data and 5 day forecast
        for(i = 0; i < 6; i++){
            if (i === 0) {
                var x = 0;
            } else {
                var x = 8*i-1;
            }
            
            $('#day-' + i + '-icon').attr("src", "http://openweathermap.org/img/w/" + data.list[x].weather[0].icon + ".png");
            $('#day-' + i + '-temp').append(data.list[x].main.temp + "°F");
            $('#day-' + i + '-wind').append(data.list[x].wind.speed + " MPH");
            $('#day-' + i + '-humidity').append(data.list[x].main.humidity + "%")
        }
    }
    );

}

// function that gets latitude and longitude using the city as an input
function getLatAndLon(city){
    // get the latitude and longitude
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=a3b8266a3ce273e91f4876eaa66f854a')
    .then(function (response) {
        return(response.json())
    })
    .then(function (data) {

        if(data[0] !== undefined){

            if (localStorage.getItem("cityList") !== null) {
                var cityArray = JSON.parse(localStorage.getItem("cityList"));
                
                // convert all cities in array to lowercase for comparison,
                // so that there's only one button for each city regardless of capitalization
                var lowerCaseCities = [];

                for (i = 0; i < cityArray.length; i++) {
                    lowerCaseCities.push(cityArray[i].toLowerCase());
                }

                if (!lowerCaseCities.includes(city.toLowerCase())) {

                    var cityButton = $('<button>');

                    cityButton.text(city).css("text-transform", "capitalize");
                    cityButton.addClass("btn btn-sm city-button my-1");

                    citySearchEl.append(cityButton);
                    cityButtonFunctional();

                    cityArray.push(city);
                    localStorage.setItem("cityList", JSON.stringify(cityArray));
                }

            } else {

                var cityButton = $('<button>');

                cityButton.text(city).css("text-transform", "capitalize");
                cityButton.addClass("btn btn-sm city-button my-1");

                citySearchEl.append(cityButton);
                cityButtonFunctional();

                var cityArray = [];
                cityArray.push(city);

                localStorage.setItem("cityList", JSON.stringify(cityArray));

            }

            clearValues();
            currentEl.text(city + dayjs().format(" (MM/D/YYYY)")).css("text-transform", "capitalize");

            displayForecast(data[0].lat, data[0].lon);
        } else {
            alert ("Couldn't find that city!")
        }

        
    }
    );
}

// use ipgeo to get user's city from their ip address
fetch('https://api.ipgeolocation.io/ipgeo?apiKey=a1d419df10e64b8e9710e164ca9b610b&fields=city')
    .then(function (response) {
        return(response.json())
    })
    // display their city and the current day using dayjs
    .then(function (data) {
        currentEl.text(data.city + dayjs().format(" (MM/D/YYYY)"));
        
        // add forecast columns to the page with initial content
        for(i = 1; i < 6; i++) {
            var forecastColEl = $('<div>');
            var forecastContentEl = $('<div>');
            var dateEl = $('<h6>');
            var iconEl = $('<img>');
            var tempEl = $('<p>');
            var windEl = $('<p>');
            var humidityEl = $('<p>');
            
            dateEl.text(dayjs().add(i, 'day').format("MM/D/YYYY"));

            iconEl.attr("id", "day-" + i + "-icon");
            tempEl.text("Temp: ");
            tempEl.attr("id", "day-" + i + "-temp");
            windEl.text("Wind: ");
            windEl.attr("id", "day-" + i + "-wind");
            humidityEl.text("Humidity: ");
            humidityEl.attr("id", "day-" + i + "-humidity");


            forecastContentEl.addClass("p-3 weather-card")
            forecastColEl.addClass("col");

            forecastContentEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
            forecastColEl.append(forecastContentEl);
            $('#forecast-row').append(forecastColEl);
            
        }

        // call display forecast using city found with ip address
        getLatAndLon(data.city);
    }
);

function clearValues(){
    for(i = 0; i < 6; i++){
        $('#day-' + i + '-temp').text("Temp: ");
        $('#day-' + i + '-wind').text("Wind: ");
        $('#day-' + i + '-humidity').text("Humidity: ");
    }
}

function initPrevSearchButtons(){
    // get city list out of storage and add buttons
    if (localStorage.getItem("cityList") !== null) {
        var cityArray = JSON.parse(localStorage.getItem("cityList"));
        //add buttons
        for (i = 0; i < cityArray.length; i++){
            var cityButton = $('<button>');

            cityButton.text(cityArray[i]).css("text-transform", "capitalize");
            cityButton.addClass("btn btn-sm city-button my-1");

            citySearchEl.append(cityButton);
        }

        cityButtonFunctional();
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    var city = cityEl.val();

    if (city == "") {
        alert ("Please enter a city name")
    } else {

        cityEl.val('');        

        getLatAndLon(city);
    }   
}

function cityButtonFunctional() {

    // creating a variable from all elements with the class "city-button"
    var cityButtonEl = $(".city-button");
  
    // listener for click events on any city button
    cityButtonEl.on('click', function (event) {
  
        var city = $(this)[0].textContent;
        getLatAndLon(city);
    })
}

initPrevSearchButtons();


// Submit event on the form
formEl.on('submit', handleFormSubmit);

