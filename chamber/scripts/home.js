// ============================================================
// San Salvador Chamber of Commerce — home.js
// Loads weather (OpenWeatherMap), member spotlights, and
// handles nav toggle + footer dates.
// ============================================================

// ---------- OpenWeatherMap config ----------
// San Salvador, El Salvador
const WEATHER_LAT = 13.6929;
const WEATHER_LON = -89.2182;
const WEATHER_API_KEY = '8967538f26a961cf6aeb02b2eff646e8';

const currentUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_LAT}&lon=${WEATHER_LON}` +
    `&units=metric&appid=${WEATHER_API_KEY}`;

const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${WEATHER_LAT}&lon=${WEATHER_LON}` +
    `&units=metric&appid=${WEATHER_API_KEY}`;

async function loadCurrentWeather() {
    try {
        const response = await fetch(currentUrl);
        if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);
        const data = await response.json();

        document.getElementById('current-temp').textContent = Math.round(data.main.temp);
        document.getElementById('weather-desc').textContent = capitalize(data.weather[0].description);

        const iconCode = data.weather[0].icon;
        const iconImg = document.getElementById('weather-icon');
        iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        iconImg.alt = data.weather[0].description;
    } catch (error) {
        document.getElementById('weather-desc').textContent = 'Weather unavailable';
        console.error('Weather error:', error);
    }
}

async function loadForecast() {
    const container = document.getElementById('forecast');
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error(`Forecast HTTP ${response.status}`);
        const data = await response.json();

        // Pick one entry per day (12:00 noon) for next 3 days
        const seen = new Set();
        const days = [];
        for (const entry of data.list) {
            const dateStr = entry.dt_txt.slice(0, 10);
            const hour = entry.dt_txt.slice(11, 13);
            if (hour === '12' && !seen.has(dateStr)) {
                seen.add(dateStr);
                days.push(entry);
                if (days.length === 3) break;
            }
        }

        container.innerHTML = '';
        days.forEach(d => {
            const date = new Date(d.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const div = document.createElement('div');
            div.className = 'forecast-day';
            div.innerHTML = `
                <p class="day">${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png" alt="${d.weather[0].description}">
                <p class="temp">${Math.round(d.main.temp)}&deg;C</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = '<p>Forecast unavailable</p>';
        console.error('Forecast error:', error);
    }
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- Spotlights ----------
async function loadSpotlights() {
    const container = document.getElementById('spotlight-container');
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // Gold (3) or Silver (2) only
        const eligible = data.members.filter(m => m.membership === 2 || m.membership === 3);
        const shuffled = eligible.sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, 3);

        const tierName = { 2: 'Silver', 3: 'Gold' };

        container.innerHTML = '';
        picks.forEach(member => {
            const card = document.createElement('article');
            card.className = 'spotlight-card';
            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo"
                     loading="lazy" onerror="this.src='images/placeholder.svg'">
                <h3>${member.name}</h3>
                <p class="tier">${tierName[member.membership]} Member</p>
                <p class="address">${member.address}</p>
                <p class="phone">${member.phone}</p>
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p>Spotlights unavailable.</p>';
        console.error('Spotlights error:', error);
    }
}

// ---------- Mobile menu toggle ----------
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// ---------- Footer dates ----------
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// ---------- Init ----------
loadCurrentWeather();
loadForecast();
loadSpotlights();
