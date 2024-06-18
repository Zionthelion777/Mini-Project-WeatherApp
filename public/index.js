document.addEventListener('DOMContentLoaded', (event) => {
    // Function to fetch weather data
    const apiKey = '260e557b72c4510447791a3b93ba60fb'; // Replace with your OpenWeatherMap API key

    function fetchWeatherData(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherDescription = data.weather[0].description;
                    const temperature = data.main.temp;
                    const location = data.name;
                    const maxTemp = data.main.temp_max;
                    const minTemp = data.main.temp_min;

                    document.querySelector('.temperature').innerHTML = `${temperature}℉`;
                    document.querySelector('.location').innerHTML = location;
                    document.querySelector('.temp-range').innerHTML = `Max: ${maxTemp}℉ Min: ${minTemp}℉`;


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
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(resp => resp.json())
            .then(data => {
                if (data.cod === "200") {
                    console.log('--->'+(JSON.stringify(data)));
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
                    maxTemp: forecast.main.temp,
                    icon: forecast.weather[0].icon
                };
            } else {
                if (forecast.main.temp > dailyForecasts[day].maxTemp) {
                    dailyForecasts[day].maxTemp = forecast.main.temp;
                    dailyForecasts[day].icon = forecast.weather[0].icon;
                }
            }
        });

        // Display the daily forecasts
        Object.keys(dailyForecasts).forEach(day => {
            const forecast = dailyForecasts[day];

            const dayElement = document.createElement('div');
            dayElement.classList.add('day');

            dayElement.innerHTML = `
                <div class="day-name">${day}</div>
                <img src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="Weather icon">
                <div class="temp">${forecast.maxTemp}℉</div>
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
               // fetchHourlyForecast(lat, lon);
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
    document.getElementById('getWeather').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        const apiKey = '260e557b72c4510447791a3b93ba60fb'; 
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const apiUrl2 =`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherDescription = data.weather[0].description;
                    const temperature = data.main.temp;
                    const location = data.name;
                    const maxTemp = data.main.temp_max;
                    const minTemp = data.main.temp_min;
  
                    document.querySelector('.temperature').innerHTML = `${temperature}℉`;
                    document.querySelector('.location').innerHTML = location;
                    document.querySelector('.temp-range').innerHTML = `Max: ${maxTemp}℉ Min: ${minTemp}℉`;
  
                    // Updates other weather details here
                    // This example does not include the hourly and daily forecasts.
                    // You will need to fetch and parse these details from the API.
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
                    console.log('--->'+(JSON.stringify(data)));
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
  });