document.addEventListener('DOMContentLoaded', (event) => {
    const apiKey = '8b1f87258c77029f37948a5789d9f82a';
    let currentUnits = 'imperial'; // Default units
    let currentCoords = null; // Store current coordinates
    let currentCity = null; // Store current city name
    let currentWeatherData = null; // Store current weather data
    let currentHourlyData = []; // Store current hourly data
    let currentSevenDayData = []; // Store current 7-day forecast data

    // Function to fetch weather data based on coordinates
    function fetchWeatherData(lat, lon) {
        currentCoords = { lat, lon };
        fetchWeatherDataCommon(`lat=${lat}&lon=${lon}`);
    }

    // Function to fetch weather data based on city name
    function fetchWeatherDataByCity(city) {
        currentCity = city;
        fetchWeatherDataCommon(`q=${city}`);
    }

    // Common function to fetch weather data
    function fetchWeatherDataCommon(query) {
        fetchCurrentWeather(query);
        fetchHourlyForecast(query);
        fetchSevenDayForecast(query);
        fetchAdditionalData(query);
    }

    // Fetch current weather data
    function fetchCurrentWeather(query) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    currentWeatherData = data;
                    const temperature = Math.round(data.main.temp);
                    const location = data.name;
                    const maxTemp = Math.round(data.main.temp_max);
                    const minTemp = Math.round(data.main.temp_min);

                    document.querySelector('.temperature').innerHTML = `${temperature}°${currentUnits === 'imperial' ? 'F' : 'C'}`;
                    document.querySelector('.location').innerHTML = location;
                    document.querySelector('.temp-range').innerHTML = `Max: ${maxTemp}°${currentUnits === 'imperial' ? 'F' : 'C'} Min: ${minTemp}°${currentUnits === 'imperial' ? 'F' : 'C'}`;
                } else {
                    alert('Error fetching weather data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    }

    // Fetch hourly forecast data
    function fetchHourlyForecast(query) {
        const apiUrl = `https://pro.openweathermap.org/data/2.5/forecast/hourly?${query}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    currentHourlyData = data.list.slice(0, 24);
                    currentHourlyPage = 0; 
                    renderHourlyForecast();
                } else {
                    alert('Error fetching hourly forecast data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the hourly forecast data:', error);
                alert('Error fetching the hourly forecast data. Please try again later.');
            });
    }



    // Render hourly forecast data
    function renderHourlyForecast() {
        const hourlyForecastList = document.querySelector('.hourly-forecast-list');
        hourlyForecastList.innerHTML = ''; // Clear previous data

        currentHourlyData.forEach(hour => {
            const hourlyElement = document.createElement('div');
            hourlyElement.className = 'hourly';

            const timeElement = document.createElement('div');
            timeElement.className = 'hourly-time';
            timeElement.innerText = new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const tempElement = document.createElement('div');
            tempElement.className = 'hourly-temp';
            tempElement.innerText = `${Math.round(hour.main.temp)}°${currentUnits === 'imperial' ? 'F' : 'C'}`; // Rounded temperature

            const weatherElement = document.createElement('div');
            weatherElement.className = 'hourly-weather';
            weatherElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Weather icon">`;

            hourlyElement.appendChild(timeElement);
            hourlyElement.appendChild(tempElement);
            hourlyElement.appendChild(weatherElement);

            hourlyForecastList.appendChild(hourlyElement);
        });
    }

    // Fetch 7-day forecast data
    function fetchSevenDayForecast(query) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?${query}&appid=${apiKey}&units=${currentUnits}&cnt=7`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    currentSevenDayData = data.list;
                    renderSevenDayForecast();
                } else {
                    alert('Error fetching 7-day forecast data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the 7-day forecast data:', error);
                alert('Error fetching the 7-day forecast data. Please try again later.');
            });
    }

    // Render 7-day forecast data
    function renderSevenDayForecast() {
        const dailyForecastContainer = document.querySelector('.daily-forecast');
        dailyForecastContainer.innerHTML = ''; // Clear previous data

        currentSevenDayData.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' });

            const dayElement = document.createElement('div');
            dayElement.classList.add('day');

            dayElement.innerHTML = `
                <div class="day-name">${day}</div>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
                <div class="temp">${Math.round(forecast.temp.day)}°${currentUnits === 'imperial' ? 'F' : 'C'}</div>
            `;

            dailyForecastContainer.appendChild(dayElement);
        });
    }

    // Fetch additional weather data
    function fetchAdditionalData(query) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=${currentUnits}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    renderAdditionalData(data.list[0]);
                } else {
                    alert('Error fetching additional data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the additional data:', error);
                alert('Error fetching the additional data. Please try again later.');
            });
    }

    // Render additional weather data
    function renderAdditionalData(data) {
        const additionalDataContainer = document.querySelector('.additional-data') || document.createElement('div');
        additionalDataContainer.className = 'additional-data';

        additionalDataContainer.innerHTML = `
            <div class="data-item" data-info="Cloudiness: ${data.clouds?.all ?? 'N/A'}%">
                <i class="fas fa-cloud"></i>
            </div>
            <div class="data-item" data-info="Wind Speed: ${data.wind?.speed ?? 'N/A'} ${currentUnits === 'imperial' ? 'mph' : 'm/s'}">
                <i class="fas fa-wind"></i>
            </div>
            <div class="data-item" data-info="Wind Direction: ${data.wind?.deg ?? 'N/A'}°">
                <i class="fas fa-compass"></i>
            </div>
            <div class="data-item" data-info="Wind Gust: ${data.wind?.gust ?? 'N/A'} ${currentUnits === 'imperial' ? 'mph' : 'm/s'}">
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

    // Toggle units between Celsius and Fahrenheit
    document.getElementById('toggleUnits').addEventListener('click', function() {
        currentUnits = currentUnits === 'imperial' ? 'metric' : 'imperial';
        const buttonText = currentUnits === 'imperial' ? '°C/°F' : '°F/°C';
        this.innerHTML = buttonText;

        // Update the weather data using the new units
        if (currentCoords) {
            fetchWeatherData(currentCoords.lat, currentCoords.lon);
        } else if (currentCity) {
            fetchWeatherDataByCity(currentCity);
        }
    });

    // Fetch weather data based on city input
    document.getElementById('getWeather').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        fetchWeatherDataByCity(city);
    });

    // Show humidity data
    document.getElementById('showHumidity').addEventListener('click', function() {
        if (currentWeatherData && currentWeatherData.main && typeof currentWeatherData.main.humidity !== 'undefined') {
            alert('Current Humidity: ' + currentWeatherData.main.humidity + '%');
        } else {
            alert('Humidity data not available.');
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

    // Get current location on page load
    getCurrentLocation();

    // Initialize city name autocomplete
    autocompleteCityName();

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
    // Function to get current location
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon);
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
                const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}&units=${currentUnits}`;

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
});

 //fetches news
 fetchNewsData();

 // Function to fetch news data
 function fetchNewsData() {
     const newsApiKey = '4a6195c720414a1ab7f0068f947f8853';
     const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;

     fetch(apiUrl)
         .then(response => response.json())
         .then(data => {
             if (data.status === "ok") {
                 renderNewsData(data.articles);
             } else {
                 alert('Error fetching news data. Please try again.');
             }
         })
         .catch(error => {
             console.error('Error fetching the news data:', error);
             alert('Error fetching the news data. Please try again later.');
         });
 }

 // Function to render news data
 function renderNewsData(articles) {
     const newsContainer = document.querySelector('.news-container') || document.createElement('div');
     newsContainer.className = 'news-container';
     newsContainer.innerHTML = ''; // Clear any previous data

     articles.forEach(article => {
         const articleElement = document.createElement('div');
         articleElement.className = 'article';

         articleElement.innerHTML = `
             <img src="${article.urlToImage}" alt="News Image" class="news-image">
             <div class="news-title">${article.title}</div>
             <div class="news-author">${article.author ? 'By ' + article.author : ''}</div>
             <div class="news-description">${article.description}</div>
             <a href="${article.url}" target="_blank" class="news-link">Read more</a>
         `;

         newsContainer.appendChild(articleElement);
     });

     // Append the news container to the body if it's not already there
     if (!document.querySelector('.news-container')) {
         document.body.appendChild(newsContainer);
     }
 }