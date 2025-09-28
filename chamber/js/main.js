async function displaySpotlight() {
    const container = document.getElementById('spotlight-container');

    const response = await fetch('data/company-spotlight.json')
    const data = await response.json();

    const filtered = data.filter(c => c.membership === 'gold' || c.membership === 'silver');

    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const spotlight = shuffled.slice(0, 3);

    container.innerHTML = '';
    spotlight.forEach(c => {
        const card = document.createElement('div');
        card.className = 'spotlight-card';
        card.innerHTML = `
            <img src="${c.logo}" alt="${c.name} Logo">
            <h3>${c.name}</h3>
            <p>Membership: ${c.membership}</p>
            <p>Phone: ${c.phone}</p>
            <p>Address: ${c.address}</p>
            <p><a href="${c.website}" target="_blank">Website</a></p>
        `;
        container.appendChild(card);
    });
}

displaySpotlight();

async function getWeather() {
    const weatherDiv = document.getElementById('weather');

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Las Vegas,US&units=imperial&appid=8967538f26a961cf6aeb02b2eff646e8`);
        const data = await res.json();

        const current = data.list[0];
        const forecast = data.list.slice(1, 4)

        weatherDiv.innerHTML = `
            <p>Current Temp: ${current.main.temp}°F</p>
            <p>${current.weather[0].description}</p>
            <ul>
                ${forecast.map(f => `<li>${new Date(f.dt*1000).toLocaleDateString()}: ${f.main.temp}°F</li>`).join('')}
            </ul>
        `;
    } catch (err) {
       const mockWeather = {
            temp: 86,
            description: 'Sunny',
            forecast: [
                { day: 'Tomorrow', temp: 88 },
                { day: 'Day After', temp: 85 },
                { day: '3rd Day', temp: 87 }
            ]
        };

        weatherDiv.innerHTML = `
            <p>Current Temp: ${mockWeather.temp}°F</p>
            <p>${mockWeather.description}</p>
            <ul>
                ${mockWeather.forecast.map(f => `<li>${f.day}: ${f.temp}°F</li>`).join('')}
            </ul>
        `;
        console.warn('Weather API failed, showing mock data:', err);
    }
}

getWeather();
