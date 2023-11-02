// Use jquery to get elements from the page
var formEl = $('#city-form');
// added css to keep city names capitalized
var cityEl = $('input[name="city"]').css("text-transform", "capitalize");
var currentEl = $('#current');

// function that takes in latitude and longitude to display current weather and 5-day forecast
function displayForecast(lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=a3b8266a3ce273e91f4876eaa66f854a')
    .then(function (response) {
        return(response.json());
    })
    .then(function (data) {
        // current weather data
        $('#current-temp').append(data.list[0].main.temp + "°F");
        $('#current-wind').append(data.list[0].wind.speed + " MPH");
        $('#current-humidity').append(data.list[0].main.humidity + "%");

        // 5 day forecast
        for(i = 1; i < 6; i++){
            $('#day-' + i + '-temp').append(data.list[8*i-1].main.temp + "°F");
            $('#day-' + i + '-wind').append(data.list[8*i-1].wind.speed + " MPH");
            $('#day-' + i + '-humidity').append(data.list[8*i-1].main.humidity + "%")
        }
    }
    );

}

// function that gets latitude and longitude using the city as an input
function getLatAndLon(city){
    // get the latitude and longitude
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=a3b8266a3ce273e91f4876eaa66f854a')
    .then(function (response) {
        return(response.json());
    })
    .then(function (data) {
        displayForecast(data[0].lat, data[0].lon);
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
            var tempEl = $('<p>');
            var windEl = $('<p>');
            var humidityEl = $('<p>');
            
            dateEl.text(dayjs().add(i, 'day').format("MM/D/YYYY"));

            tempEl.text("Temp: ");
            tempEl.attr("id", "day-" + i + "-temp");
            windEl.text("Wind: ");
            windEl.attr("id", "day-" + i + "-wind");
            humidityEl.text("Humidity: ");
            humidityEl.attr("id", "day-" + i + "-humidity");


            forecastContentEl.addClass("p-3 weather-card")
            forecastColEl.addClass("col");

            forecastContentEl.append(dateEl, tempEl, windEl, humidityEl);
            forecastColEl.append(forecastContentEl);
            $('#forecast-row').append(forecastColEl);
            
        }

        // call display forecast using city found with ip address
        getLatAndLon(data.city);
    }
);


function handleFormSubmit(event) {
    event.preventDefault();

    if (cityEl.val() === "") {
        console.log("Please enter a city name")
    }

    currentEl.text(cityEl.val() + dayjs().format(" (MM/D/YYYY)"))
}


// Submit event on the form
formEl.on('submit', handleFormSubmit);