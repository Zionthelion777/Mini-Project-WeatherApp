const severeWeatherAlertsAPIKey = "22KrLqgipPzjZyD6YRSg0S22mAmXsXUPxJtnFkleQBtYPwnppphXJQQJ99AFACYeBjFqD6kjAAAgAZMPlcTp";
const openWeatherApiKey = "8b1f87258c77029f37948a5789d9f82a";
let hourTimer;
const HOUR_LENGTH = 3600000;

// Ensure toggles are active while on other pages / upon reload
let enableLocalNotifsToggle = document.getElementById('enable-local-notifs');
// Turn on/off notifs
if (enableLocalNotifsToggle) {
        enableLocalNotifsToggle.addEventListener('change', (e) => {
            if ( e.target.checked ) {
                enableNotifs().then((areNotifsEnabled) => {
                    if (areNotifsEnabled) { // able to enable notifs
                        
                        localStorage.setItem('areLocalNotifsEnabled', 'true');
                        localStorage.setItem('isLocalJustEnabled', 'true');
                        callLocalNotifs().then(success => {
                            if (success) {
                                e.target.checked = true;
                            } else {
                                e.target.checked = false;
                                localStorage.setItem('areLocalNotifsEnabled', 'false');
                            }
                        });
                    } else { // Unable to enable notifs
                        e.target.checked = false;
                        localStorage.setItem('areLocalNotifsEnabled', 'false');
                    }
                }).catch((error) => { // Unable to enable notifs
                    localStorage.setItem('areLocalNotifsEnabled', 'false');
                });
            }
            // Turn off local notifs
            else {
                clearTimeout(hourTimer);
                localStorage.setItem('areLocalNotifsEnabled', 'false');
                localStorage.setItem('isLocalJustEnabled', 'false');
            }
        });
}

// Allow for search notifs on main page
let enableSearchNotifsToggle = document.getElementById('enable-search-notifs');
if (enableSearchNotifsToggle) {
    enableSearchNotifsToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            enableNotifs().then((areNotifsEnabled) => {
                if (areNotifsEnabled) { // able to enable notifs
                    localStorage.setItem('areSearchNotifsEnabled', 'true');
                } else { // Unable to enable notifs
                    e.target.checked = false;
                    localStorage.setItem('areSearchNotifsEnabled', 'false');
                }
            }).catch((error) => { // Unable to enable notifs
                console.log('Failed to enable notifications:', error);
            });
        } else {
            localStorage.setItem('areSearchNotifsEnabled', 'false');
        }
    });
}

// Load notif state on any page
window.addEventListener('load', () => {
    // Check if notification permissions were revoked
    if (Notification.permission !== 'granted') {
        localStorage.setItem('areLocalNotifsEnabled', 'false');
        localStorage.setItem('areSearchNotifsEnabled', 'false');
    }
    // Check if location permissions were revoked
    if (checkLocationPermission() !== 'granted') {
        localStorage.setItem('areLocalNotifsEnabled', 'false');
    }

    // Call hourly notifs
    let localNotifStatus = localStorage.getItem('areLocalNotifsEnabled');
    if (localNotifStatus === 'true') {
        callLocalNotifs();
    } else {
        clearTimeout(hourTimer);
    }

    // If on notifications page, set correct toggles
    if (enableLocalNotifsToggle) {
        // Set searchNotif status
        let localNotifStatus = localStorage.getItem('areLocalNotifsEnabled');
        document.getElementById('enable-local-notifs').checked = localNotifStatus === 'true' ? true : false;

        // Set searchNotif status
        let searchNotifStatus = localStorage.getItem('areSearchNotifsEnabled');
        document.getElementById('enable-search-notifs').checked = searchNotifStatus === 'true' ? true : false;
    }
})


// Check if you're on main page for search notifs
let getWeatherButton = document.getElementById('getWeather');

if(getWeatherButton) {
    getWeatherButton.addEventListener('click', function () {
        const city = document.getElementById('city').value;
        callSearchNotifs(city);
    });
}

// Handle toggle on
function enableNotifs() {
    return new Promise((resolve, reject) => {
        // Browser doesn't support notifs
        if (!('Notification' in window)) {
            alert("This browser does not support notifications.");
            resolve(false);
        } else { // Browser supports notifs
            if (Notification.permission !== "granted") {
                Notification.requestPermission().then((permission) => {
                    // Notification permission granted
                    if (permission === 'granted') {
                        resolve(true);
                    } else { // Notification permission not granted; can't turn toggle on
                        alert('Allow notifications to turn this feature on.');
                        resolve(false);
                    }
                }).catch((err) => {
                    alert('Error enabling notifications. Please try again later.');
                    reject(false);
                })
            } else {
                resolve(true);
            }
        }
    });
}

// Call notifications every hour (and when notifs are first turned on)
function callLocalNotifs() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('areLocalNotifsEnabled') === 'true') {
            let lastNotifTime = localStorage.getItem('lastNotifTime');
            let timeSinceLastNotif = Date.now() - lastNotifTime;
            
            // If it's been over an hour, send new notif
            if (!lastNotifTime || timeSinceLastNotif >= HOUR_LENGTH
                || localStorage.getItem('isLocalJustEnabled') === 'true') {
                if (navigator.geolocation) {
                    getLocation().then(currentCoords => {
                        if (currentCoords !== null) {
                            sendNotifs(getSevereAlerts, currentCoords);
                            localStorage.setItem('lastNotifTime', Date.now());
                            hourTimer = setTimeout(callLocalNotifs, HOUR_LENGTH);
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }).catch(error => {
                        alert("Failed to enable location-based notifications.");
                        reject(error);
                    })
                } else { // Geolocation not supported
                    alert('Geolocation is not supported by this browser.');
                    resolve(false);
                }
                localStorage.setItem('isLocalJustEnabled', 'false');
            } else {
                // Reduce how much time is left
                hourTimer = setTimeout(callLocalNotifs, HOUR_LENGTH - timeSinceLastNotif);
                resolve(true);
            }
        }
    });
}

// Bring up severe weather notifications for cities that are searched up, if setting is on
function callSearchNotifs(city) {
    let areSearchNotifsEnabled = localStorage.getItem('areSearchNotifsEnabled');
    if (areSearchNotifsEnabled === 'false') {
        return;
    }

    // If city exists
    if (getCityCoords(city)) {
        getCityCoords(city).then(cityCoords => {
            sendNotifs(getSevereAlerts, cityCoords);
        }).catch(error => {
            console.log("City not found.");
        });
    }
}

// Create & send out notifs
function sendNotifs(alertType, coords) {
    alertType(coords).then(alertData => {
        for (const alert of alertData) {
            let title = alert.title;
            let body = alert.body;
            const notification = new Notification(title, { body: body });
        }
    }).catch(error => {
        console.log('Error:', error);
    });
}

// Receive local alerts
function getLocalAlerts() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            // Resolve with null if geolocation is not supported
            resolve(null);
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position.coords),
                (error) => resolve(null) // Resolve with null if there is an error
            );
        }
    });
}

// Get location for location-specific notifs
function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            // check if we can get location
            checkLocationPermission().then(permissionStatus => {
                if (permissionStatus === 'granted') {
                    // Permission already granted, get the current position
                    navigator.geolocation.getCurrentPosition((position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        resolve({ lat, lon });
                    }, (error) => {
                        reject(error);
                    });
                // Location not allowed
                } else if (permissionStatus === 'denied') {
                    alert("Allow location permissions to use the location-based notifications.");
                    resolve(null);
                } else {
                    alert("Allow location permissions to use the location-based notifications.");
                    resolve(null);
                }
            }).catch(error => {
                resolve(null);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Check location permissions
function checkLocationPermission() {
    // Check if the Permissions API is supported
    if (!navigator.permissions) {
        return Promise.resolve('unsupported');
    }

    // Send query
    return navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        return permissionStatus.state; // 'granted', 'denied', or 'prompt'
    }).catch(error => {
        console.error("Error checking geolocation permission: ", error);
    });
}

// Retrieve severe weather alert information from API
function getSevereAlerts(coords) {
    let lat = coords.lat;
    let lon = coords.lon;
    const severeApiUrl = `https://atlas.microsoft.com/weather/severe/alerts/json?api-version=1.1&query=${lat},${lon}&subscription-key=${severeWeatherAlertsAPIKey}`;
    return new Promise((resolve, reject) => {
        let alerts = [];
        fetch(severeApiUrl)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                  console.error("HTTP Error " + response.status);
                }
            })
            .then(data => {
                let topic = "severe-weather-alert";
                for (let i = 0; i < data.results.length; i++) {
                    let severeAlert = data.results[i];
                    let title = severeAlert.description.english;
                    let areas = data.results[i].alertAreas;
                    for (let j = 0; j < areas.length; j++) {
                        title += " (" + areas[j].name + ")";
                        let body = areas[j].summary;
                        let alertData = { topic, title, body };
                        alerts.push(alertData);
                    }
                }
                resolve(alerts);
            })
            .catch(error => {
                alert('Error fetching severe weather alert data. Please try again later.');
                reject(error);
            });
    });
}

// Get coordinates from city name (only first result)
function getCityCoords(city) {
    geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherApiKey}`;
    return new Promise((resolve, reject) => {
        fetch(geocodingApiUrl)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.error("HTTP Error " + response.status);
            }
        })
        .then(data => {
            resolve({ lat: data[0].lat, lon: data[0].lon });
        })
        .catch(error => {
            reject(error);
        });
    });
}

// Get coordinates from city name
function getCityCoords(city) {
    geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherApiKey}`;
    return new Promise((resolve, reject) => {
        fetch(geocodingApiUrl)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.error("HTTP Error " + response.status);
            }
        })
        .then(data => {
            resolve({ lat: data[0].lat, lon: data[0].lon });
        })
        .catch(error => {
            console.error('Error finding city coordinates: ', error);
            reject(error);
        });
    });
}

// Handle click event for the Back to Home button
document.getElementById('backHomeButton').addEventListener('click', function() {
    window.location.href = '/index.html';
  });