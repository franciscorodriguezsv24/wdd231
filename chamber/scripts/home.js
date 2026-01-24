// Home Page JavaScript

// OpenWeatherMap API Configuration
// San Salvador coordinates: 13.6929, -89.2182
const LAT = 13.6929;
const LON = -89.2182;
const API_KEY = '8967538f26a961cf6aeb02b2eff646e8';
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');
const currentWeatherDiv = document.getElementById('currentWeather');
const weatherForecastDiv = document.getElementById('weatherForecast');
const spotlightsContainer = document.getElementById('spotlightsContainer');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setFooterDates();
    fetchWeatherData();
    fetchSpotlights();
});

// ==================== WEATHER FUNCTIONS ====================

// Fetch current weather data
async function fetchWeatherData() {
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(WEATHER_URL),
            fetch(FORECAST_URL)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather data not available');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayWeatherError();
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const description = capitalizeWords(data.weather[0].description);
    const humidity = data.main.humidity;
    const high = Math.round(data.main.temp_max);
    const low = Math.round(data.main.temp_min);
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    currentWeatherDiv.innerHTML = `
        <div class="weather-main">
            <img src="${iconUrl}" alt="${description}" class="weather-icon" width="80" height="80">
            <div class="weather-temp">
                <span class="temp-value">${temp}</span>
                <span class="temp-unit">°C</span>
            </div>
        </div>
        <div class="weather-details">
            <p class="weather-description">${description}</p>
            <p class="weather-hi-low">High: ${high}°C | Low: ${low}°C</p>
            <p class="weather-humidity">Humidity: ${humidity}%</p>
        </div>
    `;
}

// Display 3-day forecast
function displayForecast(data) {
    // Get forecast for next 3 days at noon (12:00)
    const dailyForecasts = [];
    const today = new Date().getDate();
    const processedDays = new Set();

    for (const item of data.list) {
        const forecastDate = new Date(item.dt * 1000);
        const forecastDay = forecastDate.getDate();
        const forecastHour = forecastDate.getHours();

        // Skip today and get one forecast per day (preferably around noon)
        if (forecastDay !== today && !processedDays.has(forecastDay)) {
            if (forecastHour >= 11 && forecastHour <= 14) {
                dailyForecasts.push({
                    date: forecastDate,
                    temp: Math.round(item.main.temp),
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                });
                processedDays.add(forecastDay);
            }
        }

        if (dailyForecasts.length >= 3) break;
    }

    // If we don't have enough forecasts, fill with available data
    if (dailyForecasts.length < 3) {
        for (const item of data.list) {
            const forecastDate = new Date(item.dt * 1000);
            const forecastDay = forecastDate.getDate();

            if (forecastDay !== today && !processedDays.has(forecastDay)) {
                dailyForecasts.push({
                    date: forecastDate,
                    temp: Math.round(item.main.temp),
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                });
                processedDays.add(forecastDay);
            }

            if (dailyForecasts.length >= 3) break;
        }
    }

    const forecastHTML = dailyForecasts.map(forecast => {
        const dayName = forecast.date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.icon}.png`;

        return `
            <div class="forecast-day">
                <p class="forecast-day-name">${dayName}</p>
                <img src="${iconUrl}" alt="${forecast.description}" width="50" height="50">
                <p class="forecast-temp">${forecast.temp}°C</p>
            </div>
        `;
    }).join('');

    weatherForecastDiv.innerHTML = `
        <h3>3-Day Forecast</h3>
        <div class="forecast-days">
            ${forecastHTML}
        </div>
    `;
}

// Display weather error message
function displayWeatherError() {
    currentWeatherDiv.innerHTML = `
        <div class="weather-error">
            <p>Weather data currently unavailable.</p>
            <p>Please check back later.</p>
        </div>
    `;
    weatherForecastDiv.innerHTML = '';
}

// Capitalize first letter of each word
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// ==================== SPOTLIGHTS FUNCTIONS ====================

// Fetch and display member spotlights
async function fetchSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to load members data');
        }
        const data = await response.json();

        // Filter gold (3) and silver (2) members only
        const eligibleMembers = data.members.filter(
            member => member.membershipLevel === 3 || member.membershipLevel === 2
        );

        // Randomly select 2-3 members
        const spotlightCount = Math.random() < 0.5 ? 2 : 3;
        const selectedMembers = getRandomMembers(eligibleMembers, spotlightCount);

        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Error fetching spotlights:', error);
        spotlightsContainer.innerHTML = '<p class="error-message">Unable to load member spotlights.</p>';
    }
}

// Get random members from array
function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Display spotlight cards
function displaySpotlights(members) {
    spotlightsContainer.innerHTML = members.map(member => {
        const membershipLabel = getMembershipLabel(member.membershipLevel);
        const membershipClass = getMembershipClass(member.membershipLevel);

        return `
            <article class="spotlight-card">
                <div class="spotlight-image">
                    <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" width="150" height="100">
                </div>
                <div class="spotlight-info">
                    <h3 class="spotlight-name">${member.name}</h3>
                    <p class="spotlight-address">${member.address}</p>
                    <p class="spotlight-phone">${member.phone}</p>
                    <a href="${member.website}" class="spotlight-website" target="_blank" rel="noopener noreferrer">Visit Website</a>
                    <span class="membership-badge ${membershipClass}">${membershipLabel} Member</span>
                </div>
            </article>
        `;
    }).join('');
}

// Get membership label based on level
function getMembershipLabel(level) {
    switch (level) {
        case 3:
            return 'Gold';
        case 2:
            return 'Silver';
        default:
            return 'Member';
    }
}

// Get membership CSS class based on level
function getMembershipClass(level) {
    switch (level) {
        case 3:
            return 'gold';
        case 2:
            return 'silver';
        default:
            return 'member';
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Setup mobile menu toggle
function setupMobileMenu() {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open');
        const isOpen = mainNav.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });
}

// Set copyright year and last modified date
function setFooterDates() {
    // Set current year
    const currentYear = new Date().getFullYear();
    currentYearSpan.textContent = currentYear;

    // Set last modified date
    const lastModified = new Date(document.lastModified);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    lastModifiedSpan.textContent = lastModified.toLocaleDateString('en-US', options);
}
