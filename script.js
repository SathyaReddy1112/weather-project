document.getElementById('getWeather').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    fetchWeather(location);
});

document.getElementById('getCurrentLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoordinates(lat, lon);
        }, function() {
            alert("Geolocation is not enabled or permission denied.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function fetchWeather(location) {
    const apiKey = '5134be7423b85acc2409c28c93c611d9'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            fetchHourlyForecast(data.coord.lat, data.coord.lon);
            fetchWeatherAlerts(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            alert(error.message);
        });
}

function fetchWeatherByCoordinates(lat, lon) {
    const apiKey = '5134be7423b85acc2409c28c93c611d9'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            fetchHourlyForecast(data.coord.lat, data.coord.lon);
            fetchWeatherAlerts(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            alert(error.message);
        });
}

function displayWeather(data) {
    const city = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;

    document.getElementById('city').innerText = city;
    document.getElementById('temperature').innerText = `Temperature: ${temperature}°C`;
    document.getElementById('description').innerText = `Condition: ${description}`;
    document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;
    document.getElementById('weatherResult').style.display = 'block';

    // Change background based on weather condition
    changeBackground(description);
}

function changeBackground(condition) {
    const body = document.body;
    const conditionLower = condition.toLowerCase();

    // Remove existing classes
    body.className = '';

    if (conditionLower.includes('clear')) {
        body.classList.add('clear-sky');
    } else if (conditionLower.includes('cloud')) {
        body.classList.add('cloudy');
    } else if (conditionLower.includes('rain')) {
        body.classList.add('rainy');
    } else if (conditionLower.includes('snow')) {
        body.classList.add('snowy');
    } else {
        body.classList.add('default');
    }
}

function fetchHourlyForecast(lat, lon) {
    const apiKey = '5134be7423b85acc2409c28c93c611d9'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const hourlyData = data.list.slice(0, 5); // Get next 5 hours
            const hourlyForecast = document.getElementById('hourlyForecast');
            hourlyForecast.innerHTML = '<h3>Hourly Forecast</h3>';

            hourlyData.forEach(item => {
                const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const temp = item.main.temp;
                const desc = item.weather[0].description;
                hourlyForecast.innerHTML += `<p>${time}: ${temp}°C, ${desc}</p>`;
            });
        });
}

function fetchWeatherAlerts(lat, lon) {
    const apiKey = '5134be7423b85acc2409c28c93c611d9'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=current,minutely,daily&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.alerts) {
                const alertsDiv = document.getElementById('alerts');
                alertsDiv.innerHTML = '<h3>Weather Alerts</h3>';
                data.alerts.forEach(alert => {
                    alertsDiv.innerHTML += `<p>${alert.event}: ${alert.description}</p>`;
                });
                alertsDiv.style.display = 'block';
            }
        });
}
