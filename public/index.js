document.addEventListener('DOMContentLoaded', (event) => {
    const apiKey = '260e557b72c4510447791a3b93ba60fb'; // Replace with your OpenWeatherMap API key
    let currentUnits = 'imperial';

    function fetchWeatherData(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    updateWeatherUI(data);
                } else {
                    alert('Error fetching weather data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    }

    function fetch24HourWeatherData(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.hourly) {
                    updateHourlyForecastUI(data.hourly);
                } else {
                    alert('Error fetching weather data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    }

    function updateWeatherUI(data) {
        const temperature = Math.round(data.main.temp); // Round the temperature
        const location = data.name;
        const maxTemp = Math.round(data.main.temp_max); // Round the max temperature
        const minTemp = Math.round(data.main.temp_min); // Round the min temperature
        const unitSymbol = currentUnits === 'imperial' ? '℉' : '℃';

        document.querySelector('.temperature').innerHTML = `${temperature}${unitSymbol}`;
        document.querySelector('.location').innerHTML = location;
        document.querySelector('.temp-range').innerHTML = `Max: ${maxTemp}${unitSymbol} Min: ${minTemp}${unitSymbol}`;
    }

    function updateHourlyForecastUI(hourlyData) {
        const unitSymbol = currentUnits === 'imperial' ? '℉' : '℃';
        const hourlyTemps = hourlyData.slice(0, 24).map(hourData => {
            const date = new Date(hourData.dt * 1000);
            const hours = date.getHours();
            const temperature = Math.round(hourData.temp); // Round the hourly temperature
            return `<div class="hour">
                        <img src="placeholder-weather-icon.png" alt="Weather Icon">
                        <div class="temp">${temperature}${unitSymbol}</div>
                        <div class="time">${hours}:00</div>
                    </div>`;
        }).join('');

        document.querySelector('.hourly-forecast').innerHTML = hourlyTemps;
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon);
                fetch24HourWeatherData(lat, lon);
            }, (error) => {
                console.error('Error getting location:', error);
                alert('Error getting location. Please enter the city manually.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    function convertTemperature(value, toUnit) {
        if (toUnit === 'metric') {
            return Math.round((value - 32) * 5 / 9); // Convert and round
        } else {
            return Math.round((value * 9 / 5) + 32); // Convert and round
        }
    }

    document.getElementById('getWeather').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    updateWeatherUI(data);
                } else {
                    alert('City not found. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    });

    document.getElementById('toggleUnits').addEventListener('click', function() {
        currentUnits = currentUnits === 'imperial' ? 'metric' : 'imperial';
        const buttonText = currentUnits === 'imperial' ? '℉/℃' : '℃/℉';
        this.innerHTML = buttonText;

        // Update the weather data using the new units
        getCurrentLocation();
    });

    // Get current location on page load
    getCurrentLocation();
});