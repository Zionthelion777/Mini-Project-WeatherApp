import { Link } from 'react-router-dom'




function WeatherMap() {
    return (
        <div>
            <h1>Weather Map Page</h1>
        </div>
    )
}

export default WeatherMap


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Map</title>
    <link rel="stylesheet" href="../index.css">
</head>
<body>
    <div id="app">
        <h1>Weather Map</h1>
        <input type="text" id="city" placeholder="Enter city name">
        <button id="getWeather">Get Weather</button>
        <div id="weatherResult"></div>
    </div>
    <script src="../script.js"></script>
</body>
</html>

