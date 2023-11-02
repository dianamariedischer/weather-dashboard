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

        // day 1 weather data
        $('#day-1-temp').append(data.list[7].main.temp + "°F");
        $('#day-1-wind').append(data.list[7].wind.speed + " MPH");
        $('#day-1-humidity').append(data.list[7].main.humidity + "%");

        // day 2 weather data
        $('#day-2-temp').append(data.list[15].main.temp + "°F");
        $('#day-2-wind').append(data.list[15].wind.speed + " MPH");
        $('#day-2-humidity').append(data.list[15].main.humidity + "%");

        // day 3 weather data
        $('#day-3-temp').append(data.list[23].main.temp + "°F");
        $('#day-3-wind').append(data.list[23].wind.speed + " MPH");
        $('#day-3-humidity').append(data.list[23].main.humidity + "%");

        // day 4 weather data
        $('#day-4-temp').append(data.list[31].main.temp + "°F");
        $('#day-4-wind').append(data.list[31].wind.speed + " MPH");
        $('#day-4-humidity').append(data.list[31].main.humidity + "%");

        // day 5 weather data
        $('#day-5-temp').append(data.list[39].main.temp + "°F");
        $('#day-5-wind').append(data.list[39].wind.speed + " MPH");
        $('#day-5-humidity').append(data.list[39].main.humidity + "%");
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
        // add the dates to the forecast columns
        $('#day-1').text(dayjs().add(1, 'day').format("MM/D/YYYY"));
        $('#day-2').text(dayjs().add(2, 'day').format("MM/D/YYYY"));
        $('#day-3').text(dayjs().add(3, 'day').format("MM/D/YYYY"));
        $('#day-4').text(dayjs().add(4, 'day').format("MM/D/YYYY"));
        $('#day-5').text(dayjs().add(5, 'day').format("MM/D/YYYY"));
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