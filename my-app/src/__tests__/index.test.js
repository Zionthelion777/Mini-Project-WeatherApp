// index.test.js

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ cod: 200, main: { temp: 72, temp_max: 75, temp_min: 65 }, weather: [{ description: "clear sky", icon: "01d" }], name: "Test City" }),
  })
);

// Mock the DOM environment
const { document } = (new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
</head>
<body>
    <div class="temperature"></div>
    <div class="location"></div>
    <div class="temp-range"></div>
    <div class="daily-forecast"></div>
    <input id="city" type="text">
    <button id="getWeather">Get Weather</button>
    <button id="toggleUnits">°C/°F</button>
    <button id="showHumidity">Show Humidity</button>
    <button id="showWindSpeed">Show Wind Speed</button>
    <button id="animatedMapButton">Animated Map</button>
    <button id="tempMapButton">Temperature Map</button>
    <button id="backHomeButton">Back to Home</button>
</body>
</html>
`)).window;

global.document = document;

require('my-app/public/index.js'); // This will execute your index.js script in the test environment

describe('Weather App', () => {

  beforeEach(() => {
    fetch.mockClear();
  });

/*   test('fetches and displays weather data for a city', async () => {
    document.getElementById('city').value = 'Test City';
    document.getElementById('getWeather').click();

    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for the fetch to resolve

    expect (document.getElementById('temperature').toBe('72'));
    expect(document.querySelector('.location').innerHTML).toBe('Test City');
    expect(document.querySelector('.temp-range').innerHTML).toBe('Max: 75℉ Min: 65℉');
  });
 */
  test('toggles temperature units', async () => {
    document.getElementById('toggleUnits').click();

    expect(document.getElementById('toggleUnits').innerHTML).toBe('°C/°F');
  });

 /*  test('fetches weather data based on city input when button is clicked', () => {
    // Set the city input value
    document.getElementById('city').value = 'Test City';
    
    // Simulate button click
    expect(document.getElementById('getWeather').toBe('Test City'));
    
  });


  test('displays humidity', () => {
    global.currentWeatherData = { main: { humidity: 55 } };
    window.alert = jest.fn(); // Mock window.alert

    document.getElementById('showHumidity').click();

    expect(window.alert).toHaveBeenCalledWith('Current Humidity: 55%');
  });

  test('displays wind speed', () => {
    global.currentWeatherData = { wind: { speed: 10 } };
    document.getElementById('showWindSpeed').click();

    // You could mock window.alert to test if it was called with the correct message
    window.alert = jest.fn();
    document.getElementById('showWindSpeed').click();
    expect(window.alert).toHaveBeenCalledWith('Current Wind Speed: 10 mph');
  }); */
});