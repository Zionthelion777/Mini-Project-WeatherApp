// import Map from 'ol/Map.js';
// import OSM from 'ol/source/OSM.js';
// import TileLayer from 'ol/layer/Tile.js';
// import View from 'ol/View.js';

// const map = new Map({
//   layers: [
//     new TileLayer({
//       source: new OSM(),
//     }),
//   ],
//   target: 'map',
//   view: new View({
//     center: [0, 0],
//     zoom: 2,
//   }),
// });

// document.getElementById('zoom-out').onclick = function () {
//   const view = map.getView();
//   const zoom = view.getZoom();
//   view.setZoom(zoom - 1);
// };

// document.getElementById('zoom-in').onclick = function () {
//   const view = map.getView();
//   const zoom = view.getZoom();
//   view.setZoom(zoom + 1);
// };

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
const weatherLayer = new TileLayer({
  source: new XYZ({
    url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=3ae9061e7ccac86682b7df1233fb8ef8',
    attributions: '© OpenWeatherMap',
  }),
});

// Initialize the map
const map = new Map({
  layers: [osmLayer, weatherLayer], // Add both layers to the map
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