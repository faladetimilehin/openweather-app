$(document).ready(function () {


  // Loading the saved cities from localStorage when the page loads
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
    $("#forecast").empty(); // Clearing the forecast when clearing cities
    $("#today").empty(); // Clearing the current weather when clearing cities
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
    var lat;
    var lon;
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b312a5f6b33bfedfd06f579030382318`;
    fetch(weatherURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        lat = data.coord.lat;
        lon = data.coord.lon;
        displayCurrentWeather(data);
      });

    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b312a5f6b33bfedfd06f579030382318`;
    fetch(forecastURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        clearForecast(); // Clearing previous forecast cards
        displayForecast(data);
      });
  }

  function clearForecast() {
    $("#forecast .card-header, #forecast .row").empty();
  }

  function displayCurrentWeather(currentData) {
    lat = currentData.coord.lat;
    lon = currentData.coord.lon;
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

    // Fetching forecast data for the current city
    weatherForecast(lat, lon);
  }

  function weatherForecast(lat, lon) {

    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b312a5f6b33bfedfd06f579030382318`;
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log(data);
        displayForecast(data); // Display the forecast data for the city
      });
  }

  function displayForecast(data) {
    // Clear previous forecast cards
    $("#forecast .card-header, #forecast ul").remove();

    // Create the "5-Day Forecast" heading
    var headingForecast = $("<h3>").addClass("card-header mb-4").text("5-Day Forecast:");

    // Create a container for the forecast cards
    var forecastContainer = $("<div>").addClass("row row-cols-md-5 gap-4");

    // Append the heading to the forecast section
    $("#forecast").append(headingForecast);

    // Loop through the forecast data for the next 5 days
    for (var i = 0; i < 40; i += 8) {
      var forecastData = data.list[i];
      var forecastDate = forecastData.dt_txt.split(" ")[0];
      var tempForecast = (forecastData.main.temp - 273.15).toFixed(2);
      var windForecast = forecastData.wind.speed;
      var humidityForecast = forecastData.main.humidity;

      // Create a forecast card
      var forecastCard = $("<div>").addClass("col-md-2 card bg-dark text-white mb-2 ");
      var forecastCardBody = $("<div>").addClass("card-body p-2");
      var forecastDateDisplay = $("<h3>").addClass("card-title").text(" " + forecastDate);
      var forecastImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecastData.weather[0].icon + ".png");
      var forecastTemp = $("<p>").addClass("card-text").text("Temp: " + tempForecast + " °C");
      var forecastWind = $("<p>").addClass("card-text").text("Wind: " + windForecast + " KPH");
      var forecastHumidity = $("<p>").addClass("card-text").text("Humidity: " + humidityForecast + " %");

      // Append elements to the forecast card body
      forecastCardBody.append(forecastDateDisplay, forecastImg, forecastTemp, forecastWind, forecastHumidity);
      forecastCard.append(forecastCardBody);

      // Append the forecast card to the forecast container
      forecastContainer.append(forecastCard);
    }

    // Append the forecast container to the forecast section
    $("#forecast").append(forecastContainer);
  }


});
