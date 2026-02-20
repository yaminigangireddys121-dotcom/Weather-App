// OpenWeatherMap API Key - Replace with your own API key
// Get free API key at: https://openweathermap.org/api
const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// Weather Display Elements
const cityName = document.getElementById('cityName');
const weatherDescription = document.getElementById('weatherDescription');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const weatherIcon = document.getElementById('weatherIcon');

// Event Listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Main function to search weather
async function searchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    // Show loading, hide previous results and errors
    showLoading();

    try {
        const weatherData = await fetchWeather(city);
        displayWeather(weatherData);
    } catch (error) {
        showError(error.message);
    }
}

// Fetch weather data from API
async function fetchWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
            throw new Error('Invalid API key. Please update your API key in script.js');
        } else {
            throw new Error('Failed to fetch weather data. Please try again later.');
        }
    }

    const data = await response.json();
    return data;
}

// Display weather information
function displayWeather(data) {
    // Hide loading and error
    hideLoading();
    hideError();

    // Update weather data
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDescription.textContent = data.weather[0].description;
    temp.textContent = Math.round(data.main.temp);
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].main;

    // Show weather info
    weatherInfo.classList.add('active');
}

// Show loading spinner
function showLoading() {
    weatherInfo.classList.remove('active');
    errorMessage.classList.remove('active');
    loading.classList.add('active');
}

// Hide loading spinner
function hideLoading() {
    loading.classList.remove('active');
}

// Show error message
function showError(message) {
    hideLoading();
    weatherInfo.classList.remove('active');
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.add('active');
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('active');
}

// Initialize with default city (optional)
async function init() {
    // Uncomment the line below to load weather for a default city on page load
    // cityInput.value = 'London';
    // searchWeather();
}

init();
