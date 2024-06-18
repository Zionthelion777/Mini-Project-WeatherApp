import { Link } from 'react-router-dom'

function Home() {
    const [weather, setWeather] = useState({
        temperature: '--℉',
        location: 'Locating...',
        maxTemp: '--℉',
        minTemp: '--℉',
    });
    const [city, setCity] = useState('');

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const fetchWeatherData = (lat, lon) => {
        const apiKey = '260e557b72c4510447791a3b93ba60fb'; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    setWeather({
                        temperature: `${data.main.temp}℉`,
                        location: data.name,
                        maxTemp: `${data.main.temp_max}℉`,
                        minTemp: `${data.main.temp_min}℉`,
                    });
                } else {
                    alert('Error fetching weather data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    };

    const getCurrentLocation = () => {
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
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleGetWeather = () => {
        const apiKey = '260e557b72c4510447791a3b93ba60fb'; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    setWeather({
                        temperature: `${data.main.temp}℉`,
                        location: data.name,
                        maxTemp: `${data.main.temp_max}℉`,
                        minTemp: `${data.main.temp_min}℉`,
                    });
                } else {
                    alert('City not found. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again later.');
            });
    };

    return (
        <div id="app">
            <div className="current-weather">
                <img src="placeholder-weather-icon.png" alt="Weather Icon" className="weather-icon" />
                <div className="temperature">{weather.temperature}</div>
                <div className="location">{weather.location}</div>
                <div className="temp-range">Max: {weather.maxTemp} Min: {weather.minTemp}</div>
            </div>
            <div className="forecast">
                <div className="today-forecast">
                    <div className="forecast-header">Today <span className="date"></span></div>
                    <div className="hourly-forecast">
                        <div className="hour">
                            <img src="placeholder-weather-icon.png" alt="Weather Icon" />
                            <div className="temp">--℉</div>
                            <div className="time">--:--</div>
                        </div>
                        {/* Additional hourly forecast elements will be added dynamically */}
                    </div>
                </div>
                <div className="seven-days-forecast">
                    <div className="forecast-header">7-Days Forecasts</div>
                    <div className="daily-forecast">
                        <div className="day">
                            <img src="placeholder-weather-icon.png" alt="Weather Icon" />
                            <div className="temp">--℉</div>
                            <div className="day-name">--</div>
                        </div>
                        {/* Additional daily forecast elements will be added dynamically */}
                    </div>
                </div>
            </div>
            <input type="text" id="city" placeholder="Enter city name" value={city} onChange={handleCityChange} />
            <button id="getWeather" onClick={handleGetWeather}>Get Weather</button>
        </div>
    );
}

export default Home