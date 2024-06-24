document.addEventListener('DOMContentLoaded', (event) => {
    const apiKey = '8b1f87258c77029f37948a5789d9f82a';

    //fetches current weather
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

    //Fetches daily forecast 
    function sevenDayWeatherForecast(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial&cnt=7`;

        fetch(apiUrl)
            .then(resp => resp.json())
            .then(data => {
                if (data.cod === "200") {
                    drawWeather(data);
                } else {
                    alert('Error fetching 7-day forecast data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the 7-day forecast data:', error);
                alert('Error fetching the 7-day forecast data. Please try again later.');
            });
    }

    // Draws the weather forecast
    function drawWeather(data) {
        const dailyForecastContainer = document.querySelector('.daily-forecast');
        dailyForecastContainer.innerHTML = ''; // Clear any previous data

        // Display the daily forecasts
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' });

            const dayElement = document.createElement('div');
            dayElement.classList.add('day');

            dayElement.innerHTML = `
                <div class="day-name">${day}</div>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
                <div class="temp">${Math.round(forecast.temp.day)}℉</div>
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
                sevenDayWeatherForecast(lat, lon);
                fetchAdditionalData(lat,lon);

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

    let currentHourlyPage = 0;
    const hoursPerPage = 5;
    let hourlyDataCache = [];
    
    // Fetches hourly forecast
    function fetchHourlyForecast(lat, lon) {
        const apiUrl3 = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
        fetch(apiUrl3)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    // Cache only the next 24 hours of data
                    hourlyDataCache = data.list.slice(0, 24);
                    currentHourlyPage = 0; // Reset to the first page
                    renderHourlyForecast(); // Render the first 5 hours
                } else {
                    alert('Error fetching hourly forecast data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the hourly forecast data:', error);
                alert('Error fetching the hourly forecast data. Please try again later.');
            });
    }

    function renderHourlyForecast() {
        const hourlyForecastList = document.querySelector('.hourly-forecast-list');
    
        // Clear any previous hourly forecast data
        hourlyForecastList.innerHTML = '';
    
        // Calculate start and end indices for the current page
        const start = currentHourlyPage * hoursPerPage;
        const end = start + hoursPerPage;
        const paginatedData = hourlyDataCache.slice(start, end);
    
        paginatedData.forEach(hour => {
            const hourlyElement = document.createElement('div');
            hourlyElement.className = 'hourly';
    
            const timeElement = document.createElement('div');
            timeElement.className = 'hourly-time';
            timeElement.innerText = new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
            const tempElement = document.createElement('div');
            tempElement.className = 'hourly-temp';
            tempElement.innerText = `${Math.round(hour.main.temp)}℉`; // Rounded temperature
    
            const weatherElement = document.createElement('div');
            weatherElement.className = 'hourly-weather';
            weatherElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Weather icon">`;
    
            hourlyElement.appendChild(timeElement);
            hourlyElement.appendChild(tempElement);
            hourlyElement.appendChild(weatherElement);
    
            hourlyForecastList.appendChild(hourlyElement);
        });
    
        // Update button states
        document.getElementById('prevHours').disabled = currentHourlyPage === 0;
        document.getElementById('nextHours').disabled = end >= hourlyDataCache.length;
    }
    
    // Event listeners for navigation buttons
    document.getElementById('prevHours').addEventListener('click', () => {
        if (currentHourlyPage > 0) {
            currentHourlyPage--;
            renderHourlyForecast();
        }
    });
    
    document.getElementById('nextHours').addEventListener('click', () => {
        if (currentHourlyPage < Math.floor(hourlyDataCache.length / hoursPerPage)) {
            currentHourlyPage++;
            renderHourlyForecast();
        }
    });
    
    // Event listener for the "Get Weather" button
    document.getElementById('getWeather').addEventListener('click', () => {
        const city = document.getElementById('city').value;
        fetchCityCoordinates(city);
    });

    // Fetches the coordinates of the city
    function fetchCityCoordinates(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const { lat, lon } = data.coord;
                    fetchHourlyForecast(lat, lon);
                } else {
                    alert('Error fetching city coordinates. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the city coordinates:', error);
                alert('Error fetching the city coordinates. Please try again later.');
            });
    }

    // Get current location on page load
    getCurrentLocation();

    // Initialize city name autocomplete
    autocompleteCityName();


    // Function to fetch additional weather data
    function fetchAdditionalData(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    const additionalData = data.list[0];
                    renderAdditionalData(additionalData);
                } else {
                    alert('Error fetching additional data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the additional data:', error);
                alert('Error fetching the additional data. Please try again later.');
            });
    }

    
    function renderAdditionalData(data) {
        const additionalDataContainer = document.querySelector('.additional-data') || document.createElement('div');
        additionalDataContainer.className = 'additional-data';
    
        additionalDataContainer.innerHTML = `
            <div class="data-item" data-info="Cloudiness: ${data.clouds?.all ?? 'N/A'}%">
                <i class="fas fa-cloud"></i>
            </div>
            <div class="data-item" data-info="Wind Speed: ${data.wind?.speed ?? 'N/A'} mph">
                <i class="fas fa-wind"></i>
            </div>
            <div class="data-item" data-info="Wind Direction: ${data.wind?.deg ?? 'N/A'}°">
                <i class="fas fa-compass"></i>
            </div>
            <div class="data-item" data-info="Wind Gust: ${data.wind?.gust ?? 'N/A'} mph">
                <i class="fas fa-wind"></i>
            </div>
            <div class="data-item" data-info="Rain Volume: ${data.rain?.['1h'] ?? 0} mm">
                <i class="fas fa-cloud-showers-heavy"></i>
            </div>
            <div class="data-item" data-info="Snow Volume: ${data.snow?.['1h'] ?? 0} mm">
                <i class="fas fa-snowflake"></i>
            </div>
            <div class="data-item" data-info="Visibility: ${data.visibility ?? 'N/A'} meters">
                <i class="fas fa-eye"></i>
            </div>
            <div class="data-item" data-info="Precipitation Probability: ${data.pop ? data.pop * 100 : 'N/A'}%">
                <i class="fas fa-tint"></i>
            </div>
        `;
    
        // Append the additional data container to the body if it's not already there
        if (!document.querySelector('.additional-data')) {
            document.body.appendChild(additionalDataContainer);
        }
    
        // Add event listeners for hover effect
        document.querySelectorAll('.data-item').forEach(item => {
            item.addEventListener('mouseenter', (event) => {
                const infoBox = document.createElement('div');
                infoBox.className = 'info-box';
                infoBox.innerText = event.currentTarget.getAttribute('data-info');
                document.body.appendChild(infoBox);
    
                const rect = event.currentTarget.getBoundingClientRect();
                infoBox.style.left = `${rect.left + window.scrollX}px`;
                infoBox.style.top = `${rect.bottom + window.scrollY + 5}px`;
            });
    
            item.addEventListener('mouseleave', () => {
                document.querySelector('.info-box').remove();
            });
        });
    }

    // Fetch weather data based on city input
    document.getElementById('getWeather').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        const apiKey = '8b1f87258c77029f37948a5789d9f82a'; 
        const apiUrl =  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${apiKey}&units=imperial`;
        const apiUrl3 = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${apiKey}&units=imperial`;
        const apiUrl4 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

        //fetches current temp based on city input 
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const temperature = Math.round(data.main.temp);
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

        //fetches daily temp based on city input
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

        //fetches hourly temp based on city input 
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

        
        fetch(apiUrl4)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    const additionalData = data.list[0];
                    renderAdditionalData(additionalData);
                } else {
                    alert('Error fetching additional data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the additional data:', error);
                alert('Error fetching the additional data. Please try again later.');
            });

    });
    // Toggle units between Celsius and Fahrenheit
    document.getElementById('toggleUnits').addEventListener('click', function() {
        currentUnits = currentUnits === 'imperial' ? 'metric' : 'imperial';
        const buttonText = currentUnits === 'imperial' ? '°C/°F' : '°F/°C';
        this.innerHTML = buttonText;

        // Update the weather data using the new units
        if (currentCoords) {
            fetchWeatherData(currentCoords.lat, currentCoords.lon);
            fetchFiveDayForecast(currentCoords.lat, currentCoords.lon);
        } else if (currentCity) {
            fetchWeatherDataByCity(currentCity);
        }
    });

    // Show humidity data
    document.getElementById('showHumidity').addEventListener('click', function() {
        if (currentWeatherData && currentWeatherData.main && typeof currentWeatherData.main.humidity !== 'undefined') {
            alert('Current Humidity: ' + currentWeatherData.main.humidity + '%');
        } else {
            alert('Humidity data not available.');
        }
    });

    // Show wind speed data
    document.getElementById('showWindSpeed').addEventListener('click', function() {
        if (currentWeatherData && currentWeatherData.wind && typeof currentWeatherData.wind.speed !== 'undefined') {
            const windSpeedUnit = currentUnits === 'imperial' ? 'mph' : 'm/s';
            alert('Current Wind Speed: ' + currentWeatherData.wind.speed + ' ' + windSpeedUnit);
        } else {
            alert('Wind speed data not available.');
        }
    });


    // Handle click event for the Animated Map Button
    document.getElementById('animatedMapButton').addEventListener('click', function() {
        window.location.href = 'animatedMap.html';
    });
    
    // Handle click event for the Temperature Map button
    document.getElementById('tempMapButton').addEventListener('click', function() {
        window.location.href = 'temperature.html';
    });
     // Handle click event for the Back to Home button
     document.getElementById('backHomeButton').addEventListener('click', function() {
        window.location.href = 'index.html';
    });     
    
    

    // Get current location on page load
    getCurrentLocation();

    
});