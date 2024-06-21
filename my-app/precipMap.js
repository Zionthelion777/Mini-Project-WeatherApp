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
const precipLayer = new TileLayer({
  source: new XYZ({
    url: 'http://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?date=1552861800&appid=8b1f87258c77029f37948a5789d9f82a',
    attributions: '© OpenWeatherMap',
  }),
});

// Initialize the map
const map = new Map({
  layers: [osmLayer, precipLayer], // Add both layers to the map
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