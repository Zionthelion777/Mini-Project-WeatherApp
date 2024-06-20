import React from 'react';
import { Link } from 'react-router-dom';

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
                <Link to="/temperature-map" className="map-icon active">
                    <img src="src/components/icons8-temperature-50.png" alt="Temperature Map" title="Temperature Map" />
                </Link>
                <Link to="/precipitation-map" className="map-icon">
                    <img src="src/components/icons8-precipitation-50.png" alt="Precipitation Map" title="Precipitation Map" />
                </Link>
                <Link to="/wind-map" className="map-icon">
                    <img src="src/components/icons8-wind-50.png" alt="Wind Map" title="Wind Map" />
                </Link>
            </div>
        </div>
    );
}

export default TemperatureMap;







