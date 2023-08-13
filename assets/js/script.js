/* eslint-disable prettier/prettier */
$(document).ready(function () {


  // Load the saved cities from localStorage when the page loads
  var savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  cities = savedCities;
  renderCityButton();

  var clearButton = $("<button>").addClass("btn btn-danger mt-3").text("Clear All");
  clearButton.on("click", function () {
    clearSavedCities();
  });
  $("#history").append(clearButton);

  function clearSavedCities() {
    cities = [];
    localStorage.removeItem("savedCities");
    renderCityButton();
    $("#forecast").empty(); // Clear the forecast when clearing cities
    $("#today").empty(); // Clear the current weather when clearing cities
  }
  // Attach click event handler to city buttons
  $(document).on("click", ".city-btn", function () {
    var cityName = $(this).attr("data-name");
    getWeatherAndForecast(cityName);
  });

  $('#search-button').on("click", function (event) {
    event.preventDefault();
    var searchCity = $('#search-input').val().trim();

    if (searchCity.length > 0) {
      getWeatherAndForecast(searchCity);

      // Save the searched city to localStorage
      saveCity(searchCity);
    } else {
      alert("Weather Dashboard\nYou must enter a City");
      return;
    }
  });

  function saveCity(cityName) {
    if (cities.indexOf(cityName) === -1) {
      cities.push(cityName);
      localStorage.setItem("savedCities", JSON.stringify(cities));
      renderCityButton();
    }
  }

  function renderCityButton() {
    $("#history").empty();

    for (var i = 0; i < cities.length; i++) {
      var a = $("<button>");
      a.addClass("btn btn-primary mt-2");
      a.attr("data-name", cities[i]);
      a.text(cities[i]);
      $("#history").append(a);
    }
  }

  function getWeatherAndForecast(cityName) {
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b312a5f6b33bfedfd06f579030382318`;
    fetch(weatherURL)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        displayCurrentWeather(data);
      });

    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=b312a5f6b33bfedfd06f579030382318`;
    fetch(forecastURL)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        displayForecast(data);
      });
  }


  function displayCurrentWeather(currentData) {
    var cityName = currentData.name;
    var today = dayjs().format("DD/MM/YYYY");
    var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png");
    var tempC = (currentData.main.temp - 273.15).toFixed(2);
    var wind = currentData.wind.speed;
    var humidity = currentData.main.humidity;

    var cityDiv = $("<div>").addClass("city");
    var pCity = $("<p>").text("" + cityName + " " + today);
    var pTemp = $("<p>").text("Temp: " + tempC + " °C");
    var pWind = $("<p>").text("Wind: " + wind + " KPH");
    var pHumidity = $("<p>").text("Humidity: " + humidity + "%");

    cityDiv.append(pCity, img, pTemp, pWind, pHumidity);
    $("#today").empty().prepend(cityDiv);

    // Fetch forecast data for the current city
    weatherForecast(cityName);
  }

  function weatherForecast(searchCity) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=b312a5f6b33bfedfd06f579030382318`;
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log(data);
        displayForecast(data); // Display the forecast data for the city
      });
  }

  function displayForecast(data) {
    if ($("#forecast .card-header").length === 0) {
      // Display the "5-Day Forecast" heading only once
      var headingForecast = $("<h3>").addClass("card-header").text("5-Day Forecast:");
      var forecastList = $("<ul>").addClass("row row-cols-md-5 gap-4 ");

      // Append the heading and forecast list to the forecast section
      $("#forecast").append(headingForecast, forecastList);
    }

    // Loop through the first 5 elements in the forecast data
    for (var i = 0; i < 5; i++) {
      var forecastData = data.list[i];
      var forecastDateTime = forecastData.dt_txt;
      var forecastDate = forecastDateTime.split(" ")[0];
      var tempForecast = (forecastData.main.temp - 273.15).toFixed(2);
      var windForecast = forecastData.wind.speed;
      var humidityForecast = forecastData.main.humidity;

      var forecastItem = $("<li>").addClass("col-md-2 card bg-dark text-white mb-2");
      var forecastCardBody = $("<div>").addClass("card-body p-2");
      var forecastDateDisplay = $("<h3>").addClass("card-title").text(" " + forecastDate);
      var forecastImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
      var forecastTemp = $("<p>").addClass("card-text").text("Temp: " + tempForecast + " °C");
      var forecastWind = $("<p>").addClass("card-text").text("Wind: " + windForecast + " KPH");
      var forecastHumidity = $("<p>").addClass("card-text").text("Humidity: " + humidityForecast + " %");

      forecastCardBody.append(forecastDateDisplay, forecastImg, forecastTemp, forecastWind, forecastHumidity);
      forecastItem.append(forecastCardBody);
      forecastList.append(forecastItem);
    }
  }

});
