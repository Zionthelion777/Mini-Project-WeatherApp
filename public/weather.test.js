const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
global.fetch = fetch;
const { window } = new JSDOM(`<!DOCTYPE html><body>
    <div class="temperature"></div>
    <div class="location"></div>
    <div class="temp-range"></div>
</body>`);
global.document = window.document;

const apiKey = '8b1f87258c77029f37948a5789d9f82a';
const fetchWeatherData = (lat, lon) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    return fetch(apiUrl)
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

                return data;
            } else {
                throw new Error('Error fetching weather data. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            throw error;
        });
};

describe('fetchWeatherData', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('updates the DOM with weather data on successful fetch', async () => {
        const mockResponse = {
            cod: 200,
            weather: [{ description: 'clear sky' }],
            main: { temp: 72, temp_max: 75, temp_min: 70 },
            name: 'Test City'
        };

        fetch.mockResponseOnce(JSON.stringify(mockResponse));

        await fetchWeatherData(35, 139);

        expect(document.querySelector('.temperature').innerHTML).toBe('72℉');
        expect(document.querySelector('.location').innerHTML).toBe('Test City');
        expect(document.querySelector('.temp-range').innerHTML).toBe('Max: 75℉ Min: 70℉');
    });

    it('throws an error and logs it on failed fetch', async () => {
        const mockError = new Error('Network error');
        fetch.mockReject(mockError);

        await expect(fetchWeatherData(35, 139)).rejects.toThrow('Network error');
    });
});