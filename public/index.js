document.addEventListener('DOMContentLoaded', (event) => {
    const apiKey = '260e557b72c4510447791a3b93ba60fb'; // Replace with your OpenWeatherMap API key
    let currentUnits = 'imperial';

    function fetchWeatherData(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherDescription = data.weather[0].description;
                    const temperature = Math.round(data.main.temp);
                    const location = data.name;
                    const maxTemp = Math.round(data.main.temp_max);
                    const minTemp = Math.round(data.main.temp_min);

                    const tempUnit = currentUnits === 'imperial' ? '℉' : '℃';

                    document.querySelector('.temperature').innerHTML = `${temperature}${tempUnit}`;
                    document.querySelector('.location').innerHTML = location;
                    document.querySelector('.temp-range').innerHTML = `Max: ${maxTemp}${tempUnit} Min: ${minTemp}${tempUnit}`;
                } else {
                    alert('Error fetching weather data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    }

    function fiveDayweatherForecast(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(resp => resp.json())
            .then(data => {
                if (data.cod === "200") {
                    console.log('--->' + (JSON.stringify(data)));
                    drawWeather(data);
                } else {
                    alert('Error fetching 5-day forecast data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the 5-day forecast data:', error);
                alert('Error fetching the 5-day forecast data. Please try again later.');
            });
    }

    // Draws the weather forecast
    function drawWeather(data) {
        const dailyForecastContainer = document.querySelector('.daily-forecast');
        dailyForecastContainer.innerHTML = ''; // Clear any previous data

        // Group forecasts by day and find the max temperature for each day
        const dailyForecasts = {};

        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' });

            if (!dailyForecasts[day]) {
                dailyForecasts[day] = {
                    maxTemp: Math.round(forecast.main.temp),
                    icon: forecast.weather[0].icon
                };
            } else {
                if (Math.round(forecast.main.temp) > dailyForecasts[day].maxTemp) {
                    dailyForecasts[day].maxTemp = Math.round(forecast.main.temp);
                    dailyForecasts[day].icon = forecast.weather[0].icon;
                }
            }
        });

        const tempUnit = currentUnits === 'imperial' ? '℉' : '℃';

        // Display the daily forecasts
        Object.keys(dailyForecasts).forEach(day => {
            const forecast = dailyForecasts[day];

            const dayElement = document.createElement('div');
            dayElement.classList.add('day');

            dayElement.innerHTML = `
                <div class="day-name">${day}</div>
                <img src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="Weather icon">
                <div class="temp">${forecast.maxTemp}${tempUnit}</div>
            `;

            dailyForecastContainer.appendChild(dayElement);
        });
    }

    // Function to get current location
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon);
                fiveDayweatherForecast(lat, lon);
            }, (error) => {
                console.error('Error getting location:', error);
                alert('Error getting location. Please enter the city manually.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Get current location on page load
    getCurrentLocation();

    // Fetch weather data based on city input
    document.getElementById('getWeather').addEventListener('click', function () {
        const city = document.getElementById('city').value;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnits}`;
        const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherDescription = data.weather[0].description;
                    const temperature = Math.round(data.main.temp);
                    const location = data.name;
                    const maxTemp = Math.round(data.main.temp_max);
                    const minTemp = Math.round(data.main.temp_min);

                    const tempUnit = currentUnits === 'imperial' ? '℉' : '℃';

                    document.querySelector('.temperature').innerHTML = `${temperature}${tempUnit}`;
                    document.querySelector('.location').innerHTML = location;
                    document.querySelector('.temp-range').innerHTML = `Max: ${maxTemp}${tempUnit} Min: ${minTemp}${tempUnit}`;
                } else {
                    alert('City not found. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });

        fetch(apiUrl2)
            .then(resp => resp.json())
            .then(data => {
                if (data.cod === "200") {
                    console.log('--->' + (JSON.stringify(data)));
                    drawWeather(data);
                } else {
                    alert('Error fetching 5-day forecast data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the 5-day forecast data:', error);
                alert('Error fetching the 5-day forecast data. Please try again later.');
            });
    });

    // Toggle units between Celsius and Fahrenheit
    document.getElementById('toggleUnits').addEventListener('click', function () {
        currentUnits = currentUnits === 'imperial' ? 'metric' : 'imperial';
        const buttonText = currentUnits === 'imperial' ? 'Switch to Celsius' : 'Switch to Fahrenheit';
        this.innerHTML = buttonText;

        // Update the weather data using the new units
        getCurrentLocation();
    });
});