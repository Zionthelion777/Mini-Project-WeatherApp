document.addEventListener('DOMContentLoaded', (event) => {
    // Function to fetch weather data
    // apiKey2 = '260e557b72c4510447791a3b93ba60fb'; 
    const apiKey = '8b1f87258c77029f37948a5789d9f82a';

    function fetchWeatherData(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherDescription = data.weather[0].description;
                    const temperature = Math.round(data.main.temp);
                    const location = data.name;
                    const maxTemp = Math.round(data.main.temp_max);
                    const minTemp = Math.round(data.main.temp_min);

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
                    maxTemp: Math.round(forecast.main.temp),
                    icon: forecast.weather[0].icon
                };
            } else {
                if (forecast.main.temp > dailyForecasts[day].maxTemp) {
                    dailyForecasts[day].maxTemp = Math.round(forecast.main.temp);
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
                fetchHourlyForecast(lat, lon);
                fiveDayweatherForecast(lat, lon);

            }, (error) => {
                console.error('Error getting location:', error);
                alert('Error getting location. Please enter the city manually.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Autocomplete function for city names
    function autocompleteCityName() {
        const input = document.getElementById('city');
        const suggestionsContainer = document.getElementById('suggestions');

        input.addEventListener('input', function () {
            const query = input.value.trim();

            if (query.length > 0) {
                const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}&units=imperial`;

                fetch(apiUrl)
                    .then(resp => resp.json())
                    .then(data => {
                        if (data.cod === "200") {
                            suggestionsContainer.innerHTML = ''; // Clear previous suggestions
                            suggestionsContainer.style.display = 'block'; // Show suggestions container

                            data.list.forEach(city => {
                                const suggestion = document.createElement('div');
                                suggestion.textContent = `${city.name}, ${city.sys.country}`;
                                suggestion.addEventListener('click', function () {
                                    input.value = city.name;
                                    suggestionsContainer.innerHTML = '';
                                    suggestionsContainer.style.display = 'none';
                                });
                                suggestionsContainer.appendChild(suggestion);
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching city suggestions:', error);
                    });
            } else {
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
            }
        });

        document.addEventListener('click', function (e) {
            if (!suggestionsContainer.contains(e.target) && e.target !== input) {
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
            }
        });
    }






    // Fetches hourly forecast
    function fetchHourlyForecast(lat, lon) {
        const apiUrl3 = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
        fetch(apiUrl3)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === "200") {
                        renderHourlyForecast(data.list);
                    } else {
                        alert('Error fetching hourly forecast data. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching the hourly forecast data:', error);
                    alert('Error fetching the hourly forecast data. Please try again later.');
                });
        }

        function renderHourlyForecast(hourlyData) {
            const hourlyForecastContainer = document.createElement('div');
            hourlyForecastContainer.className = 'hourly-forecast';
    
            hourlyData.slice(0, 12).forEach(hour => { // Display the next 12 hours
                const hourlyElement = document.createElement('div');
                hourlyElement.className = 'hour';
    
                const timeElement = document.createElement('div');
                timeElement.className = 'time';
                timeElement.innerText = new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
                const tempElement = document.createElement('div');
                tempElement.className = 'temp';
                tempElement.innerText = `${Math.round(hour.main.temp)}℉`; // Rounded temperature
    
                const weatherElement = document.createElement('div');
                weatherElement.className = 'weather';
                weatherElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Weather icon">`;
    
                hourlyElement.appendChild(timeElement);
                hourlyElement.appendChild(tempElement);
                hourlyElement.appendChild(weatherElement);
    
                hourlyForecastContainer.appendChild(hourlyElement);
            });
    
            // Clear any previous hourly forecast data
            const existingHourlyForecast = document.querySelector('.hourly-forecast');
            if (existingHourlyForecast) {
                existingHourlyForecast.remove();
            }
    
            document.getElementById('app').appendChild(hourlyForecastContainer);
        }



        

    // Get current location on page load
    getCurrentLocation();

    // Initialize city name autocomplete
    autocompleteCityName();


    // Fetch weather data based on city input
    document.getElementById('getWeather').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        const apiKey = '8b1f87258c77029f37948a5789d9f82a'; 
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const apiUrl2 =`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
        const apiUrl3 = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const temperature = data.main.temp;
                    const location = data.name;
                    const maxTemp = Math.round(data.main.temp_max);
                    const minTemp = Math.round(data.main.temp_min);
  
                    document.querySelector('.temperature').innerHTML = `${temperature}℉`;
                    document.querySelector('.location').innerHTML = location;
                    document.querySelector('.temp-range').innerHTML = `Max: ${maxTemp}℉ Min: ${minTemp}℉`;
  
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


            fetch(apiUrl3)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    renderHourlyForecast(data.list);
                } else {
                    alert('Error fetching hourly forecast data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the hourly forecast data:', error);
                alert('Error fetching the hourly forecast data. Please try again later.');
            });
        });
  });