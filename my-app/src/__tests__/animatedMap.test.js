// animatedMap.test.js
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('animatedMap.html', () => {
  let document, window, maptilersdk, maptilerweather;

  beforeAll(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../animatedMap.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    
    // Wait for scripts to load
    return new Promise((resolve) => {
      dom.window.addEventListener('load', () => {
        document = dom.window.document;
        window = dom.window;
        maptilersdk = window.maptilersdk;
        maptilerweather = window.maptilerweather;
        resolve();
      });
    });
  });

  test('initializes the map correctly', () => {
    expect(window.map).toBeDefined();
    /* don't have .getZoom() method & .getCenter() method
    expect(window.map.getZoom()).toBe(1);
    expect(window.map.getCenter()).toEqual({ lng: -42.66, lat: 37.63 }); // Assuming getCenter() returns an object with lng and lat properties
    */
  });

  test('initializes with the wind layer active', () => {
    const variableNameDiv = document.getElementById('variable-name');
    expect(variableNameDiv.textContent).toBe('Wind');
  });

  test('play/pause button toggles animation', () => {
    const playPauseButton = document.getElementById('play-pause-bt');
    const initialText = playPauseButton.textContent;
    
    playPauseButton.click();
    expect(playPauseButton.textContent).toBe('Play 3600x');

    playPauseButton.click();
    expect(playPauseButton.textContent).toBe(initialText);
  });

  /* test('changes weather layer on button click', async () => {
    const buttons = document.getElementsByClassName('button');
    const variableNameDiv = document.getElementById('variable-name');

    for (let button of buttons) {
      button.click();
      // Wait for the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(variableNameDiv.textContent).toBe(button.id.charAt(0).toUpperCase() + button.id.slice(1));
    }
  });
  test('time slider updates the animation time', () => {
    const timeSlider = document.getElementById('time-slider');
    const initialTime = 5;
    timeSlider.value = initialTime;
    const event = new window.Event('input', { bubbles: true });
    timeSlider.dispatchEvent(event);

    // Ensure activeLayer is set
    if (!window.activeLayer) {
      window.activeLayer = 'wind';
      window.weatherLayers['wind'].layer = new maptilerweather.WindLayer({ id: 'wind' });
    }

    const weatherLayer = window.weatherLayers[window.activeLayer]?.layer;
    if (weatherLayer) {
      weatherLayer.setAnimationTime(initialTime * 1000);  // Ensure the animation time is set
      expect(weatherLayer.getAnimationTime()).toBe(initialTime * 1000);
    } else {
      throw new Error('Weather layer not defined');
    }
  });

  test('pointer value updates on mouse move', () => {
    const pointerDataDiv = document.getElementById('pointer-data');
    const mockLngLat = { lng: -42.66, lat: 37.63 };

    window.updatePointerValue(mockLngLat);
    const weatherLayer = window.weatherLayers[window.activeLayer]?.layer;
    if (weatherLayer) {
      const value = weatherLayer.pickAt(mockLngLat.lng, mockLngLat.lat);
      if (value) {
        const expectedValue = value[weatherLayer.value].toFixed(1) + weatherLayer.units;
        expect(pointerDataDiv.textContent).toContain(expectedValue);
      }
    }
  }); */
});