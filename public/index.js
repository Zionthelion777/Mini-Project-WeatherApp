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
    
    //fetches hourly forecast
    function fetch24HourWeatherData(lat, lon) {
        const apiKey = '260e557b72c4510447791a3b93ba60fb';
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=imperial`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.hourly) {
                    const hourlyData = data.hourly.slice(0, 24);
        
                    //Temperature for each hour
                    const hourlyTemps = hourlyData.map((hourData, index) => {
                        const date = new Date(hourData.dt * 1000);
                        const hours = date.getHours();
                        const temperature = hourData.temp;
                        return `Hour ${hours}: ${temperature}℉`;
                    });

                    document.querySelector('.hourly-forecast').innerHTML = hourlyTemps.join('<br>');
                    document.querySelector('.hour').innerHTML = hours.join('<br>');
                    document.querySelector('.day').innerHTML = date.join('<br>');

        
                } else {
                    alert('Error fetching weather data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    }
        

  
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
  
    // Get current location on page load
    getCurrentLocation();
  
    // Fetch weather data based on city input
    document.getElementById('getWeather').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        const apiKey = '260e557b72c4510447791a3b93ba60fb'; 
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  
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
        });
  });