import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import View from 'ol/View.js';

// Create the base map layer (OpenStreetMap)
const osmLayer = new TileLayer({
  source: new OSM(),
});

// Create the weather overlay layer (OpenWeatherMap)
const tempLayer = new TileLayer({
  source: new XYZ({
    url: 'http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid=8b1f87258c77029f37948a5789d9f82a&fill_bound=true&opacity=0.6&palette=-65:821692;-55:821692;-45:821692;-40:821692;-30:8257db;-20:208cec;-10:20c4e8;0:23dddd;10:c2ff28;20:fff028;25:ffc228;30:fc8014',
    attributions: '© OpenWeatherMap',
  }),
});

// Initialize the map
const map = new Map({
  layers: [osmLayer, tempLayer], // Add both layers to the map
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

// Add zoom out functionality
document.getElementById('zoom-out').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom - 1);
};

// Add zoom in functionality
document.getElementById('zoom-in').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom + 1);
};
 // Handle click event for the Back to Home button
 document.getElementById('backHomeButton').addEventListener('click', function() {
  window.location.href = '/index.html';
});
