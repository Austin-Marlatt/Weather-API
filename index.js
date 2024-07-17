// Global Variables for reference

// Personal API Key
const openWeatherApiKey = "36c8d020e5ae406f273e9ab44de52ddd"
// An array to store local history
const localHistory = [];

const search = document.querySelector('#search-form');
const searchCity = document.querySelector('#searchCity');
// const searchHistory = document.searchCitySelector('#');

// Store the current time in a variable
const date = new Date();

// Get indivdual parts of todays date
const month = date.getMonth();
const day = date.getDate();
const year = date.getFullYear();

// Template literal to assemble data into todays date
const now = `${month}-${day}-${year}`;

const weatherSearch = async (e) => {
  e.preventDefault();
  storedSearchs(searchCity);
  const city = searchCity.value;
  console.log(city);
  // Variable that holds the `request by city name` api call
    let selectedCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${openWeatherApiKey}`

  // async fetch to api
  const resCityData = await fetch(selectedCity);
  console.log(resCityData);
  // format response into json
  const resWeather = await resCityData.json();
  console.log(resWeather);

  renderTodayForecast(resWeather);

  const lat = resWeather.coord.lat;
  const long = resWeather.coord.lon;

  const apiReq = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&cnt=5&appid=${openWeatherApiKey}`

  const resData = await fetch(apiReq);
  const fiveDayForecast = await resData.json();
  console.log(fiveDayForecast);

  renderFiveDayForecast(fiveDayForecast);
};

// Renders todays weather from the returned resWeather fetch
const renderTodayForecast = (resWeather) => {
  // Selects where in the HTMl to display data and renmoves the hidden attribute
  const today = document.querySelector('#today');
  today.removeAttribute('hidden');
  today.innerHTML = "";
  
  // Assign the returned weather data as variables for reference
  const city = resWeather.name;
  const icon = resWeather.weather[0].icon;
  const temp = resWeather.main.temp;
  const humidity = resWeather.main.humidity;
  const wind = resWeather.wind.speed;

  // Create html elements that will hold the related data
  var cityData = document.createElement('p');
  var iconData = document.createElement('img');
  // API call to get the icon SRC
  var iconSRC =  `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconData.setAttribute('src', iconSRC);
  var tempData = document.createElement('p');
  var windData = document.createElement('p');
  var humidityData = document.createElement('p');

  // Assign data to the relevant html elements

  cityData.textContent = city;
    cityData.appendChild(iconData);

  // Template literals used to display data
  tempData.textContent = `Temp: ${temp}°F`;
  humidityData.textContent = `Humidity: ${humidity}%`;
  windData.textContent = `Wind Speed: ${wind} MPH`;

  today.append(now, cityData, tempData, windData, humidityData);

};

// Function that renders the five day forecast from the returned data
const renderFiveDayForecast = (data) => {

  // For loop used to iterate over the returned data and dynamically style the page
  // Running on an offset to render to the correct element
  for (var i = 1; i < 6; i++) {
    // Finds the element with the matching id, removes the hidden attribute and sets the text to be empty
    var forecast = document.querySelector(`#day${i}`);
    forecast.removeAttribute('hidden');
    forecast.innerHTML = "";

  // Variables that store forecast data for reference
    const icon = data.list[i].weather[0].icon
    const date = data.list[i].dt_txt
    const temp = data.list[i].main.temp
    const humidity = data.list[i].main.humidity
    const wind = data.list[i].wind.speed

    // Use date methods to get tomorrows date, by adding 1 to the current iteration of `i`
    const tomorrow = new Date();
          tomorrow.setDate(
            tomorrow.getDate() + (1 + i)
          );

    // Create html elements that will hold the related data
    const dateData = document.createElement('p');
    const tempData = document.createElement('p');
    const windData = document.createElement('p');
    const humidityData = document.createElement('p');
    const iconData = document.createElement('img');
  // API call to get the icon SRC
    const iconSRC =  `https://openweathermap.org/img/wn/${icon}@2x.png`  
    iconData.setAttribute('src', iconSRC);

    // Assign data to relevant html elements
    dateData.textContent = tomorrow.toDateString()  ;

    tempData.textContent = `Temp: ${temp}°F`;
    humidityData.textContent = `Humidity: ${humidity}%`;
    windData.textContent = `Wind speed: ${wind} MPH`;
    
    // Append newly made HTMl to the parent element
    forecast.append(
      dateData,
      iconData,
      tempData,
      humidityData,
      windData,
    );
  }
}

// function to handle locally stored data for search history
const storedSearchs = (searchCity) => {

  // If this city has been searched before, cancel function
  if (localHistory.includes(searchCity.value)){
    return

  } else {
  // If city has not been searched before, add to local storage
  localHistory.push(searchCity.value);
  
  // Add city to local history as `history`
  localStorage.setItem('history', JSON.stringify(localHistory));
}};

// Function to display search history when the search bar is clicked on
const displaySearchHistory = () => {
  let option = document.querySelector("#history")
  option.innerHTML = "";
  localHistory.forEach((search) => {
    option.innerHTML = "<option>" + option.innerHTML;
    option.searchCitySelector("option").innerText = search;
  });
};

const localInit = () =>{
  let storageHistory = localStorage.getItem('history')
  if (storageHistory) { localHistory == JSON.parse(storageHistory)}
    console.log(localHistory)
  }

localInit()

search.addEventListener('submit', weatherSearch);

searchCity.addEventListener('focus', displaySearchHistory);
