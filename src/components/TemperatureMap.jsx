import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Assuming your CSS file is named index.css

function TemperatureMap() {
    return (
        <div id="app">
            <div className="header">
                <h1>Temperature Map</h1>
            </div>
            <div className="map-container">
                <img src="placeholder-temperature-map.png" alt="Temperature Map" className="map-placeholder" />
            </div>
            <div className="footer">
                <Link to="/temperature" className="map-icon active">
                    <img src="temperature-icon.png" alt="Temperature Map" title="Temperature Map" />
                </Link>
                <Link to="/precipitation" className="map-icon">
                    <img src="precipitation-icon.png" alt="Precipitation Map" title="Precipitation Map" />
                </Link>
                <Link to="/wind" className="map-icon">
                    <img src="wind-icon.png" alt="Wind Map" title="Wind Map" />
                </Link>
            </div>
        </div>
    );
}

export default TemperatureMap;







