const severeWeatherAlertsAPIKey = "22KrLqgipPzjZyD6YRSg0S22mAmXsXUPxJtnFkleQBtYPwnppphXJQQJ99AFACYeBjFqD6kjAAAgAZMPlcTp";
const openWeatherApiKey = "8b1f87258c77029f37948a5789d9f82a";
let hourTimer;

// Ensure toggles are active while on other pages / upon reload
const enableNotifsToggle = document.getElementById('enable-notifs');
const enableSearchNotifsToggle = document.getElementById('enable-search-notifs');

enableNotifsToggle.addEventListener('change', (e) => {
    // Turn on/off notifs
    if ( e.target.checked ) {
        enableNotifs().then((areNotifsEnabled) => {
            if (areNotifsEnabled) {
                console.log('Notifications are enabled:', areNotifsEnabled);
                localStorage.setItem('areNotifsEnabled', 'true');
            } else {
                e.target.checked = false;
                localStorage.setItem('areNotifsEnabled', 'false');
            }
        }).catch((error) => { // Can't turn off notifs
            console.log('Unable to enable notifications:', error);
        });
    }
    // Turn off notifs
    else {
        clearTimeout(hourTimer);
        localStorage.setItem('areNotifsEnabled', 'false');
    }
});

enableSearchNotifsToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        localStorage.setItem('areSearchNotifsEnabled', 'true');
    } else {
        localStorage.setItem('areSearchNotifsEnabled', 'false');
    }
});

window.addEventListener('load', () => {
    let notifStatus = localStorage.getItem('areNotifsEnabled');
    document.getElementById('enable-notifs').checked = notifStatus === 'true' ? true : false;
    if ( notifStatus === 'true' )
        callRegularNotifs();
    else {
        clearTimeout(hourTimer);
    }

    let searchNotifStatus = localStorage.getItem('areSearchNotifsEnabled');
    document.getElementById('enable-search-notifs').checked = searchNotifStatus === 'true' ? true : false;
})

// Handle toggle on
function enableNotifs() {
    console.log("Enable notifs");
    return new Promise((resolve, reject) => {
        console.log("I'm in");
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications.');
            alert("This browser does not support notifications.");
            resolve(false);
        } else {
            console.log("Notifs in browser");
            if (Notification.permission !== "granted") {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        console.log("Permission granted");

                        // Set start time
                        let notifTime = new Date();
                        localStorage.setItem('lastNotifTime', notifTime);

                        getLocation().then(currentCoords => {
                            sendNotifs(getSevereAlerts, currentCoords);
                        }).catch(error => {
                            console.log('Error getting local notif: ', error);
                        });

                        resolve(true);
                    } else {
                        console.log('Permission not granted.');
                        alert('Allow notifications to turn this feature on.');
                        resolve(false);
                    }
                }).catch((err) => {
                    console.log('An error occurred while granting notification permissions. ', err);
                    alert('Error enabling notifications. Please try again later.');
                    reject(err);
                })
            } else {
                callRegularNotifs();
                resolve(true);
            }
        }
    });
}

// Call notifications every hour (and when notifs are first turned on)
function callRegularNotifs() {
    let timeSinceLastNotif = Date.now() - localStorage.getItem('lastNotifTime');

    if (timeSinceLastNotif >= 3600000 || !timeSinceLastNotif) {
        getLocation().then(currentCoords => {
            sendNotifs(getSevereAlerts, currentCoords);
            localStorage.setItem('lastNotifTime', Date.now());
            hourTimer = setTimeout(callRegularNotifs, 3600000);
        }).catch(error => {
            console.log('Error getting local notifs: ', error);
        });
    }
}

// Bring up severe weather notifications for cities that are searched up, if setting is on
function callSearchNotifs(city) {
    let areSearchNotifsEnabled = localStorage.getItem('areSearchNotifsEnabled');
    if (areSearchNotifsEnabled === 'false') {
        return;
    }
    
    getCityCoords(city).then(cityCoords => {
        sendNotifs(getSevereAlerts, cityCoords);
    }).catch(error => {
        console.log('Error getting city notifs: ', error);
    });
}

// Create & send out notifs
function sendNotifs(alertType, coords) {
    alertType(coords).then(alertData => {
        for (const alert of alertData) {
            let title = alert.title;
            let body = alert.body;
            console.log(title, body);
            const notification = new Notification(title, { body: body });
        }
    }).catch(error => {
        console.log('Error:', error);
    });
}

// Receive regular alerts
function getRegularAlerts() {
    return new Promise((resolve, reject) => {
        let alerts = [];
        getLocation()
            .then(currentCoords => getSevereAlerts(currentCoords.lat, currentCoords.lon))
            .then(fetchedAlerts => {
                alerts.push(...fetchedAlerts);
                console.log(alerts.length);
                resolve(alerts);
            })
            .catch(error => {
                console.log("Error:", error);
                reject(error);
            });
    });
}

// Get location for location-specific notifs
function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log("Geolocation: ", lat, ",", lon);
                resolve({ lat, lon });
            }, (error) => {
                reject(error);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Get severe weather alerts
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
                console.error('Error fetching severe weather alert data:', error);
                alert('Error fetching severe weather alert data. Please try again later.');
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

// // DAILY WEATHER ALERTS

// // Set weather alerts for same time every day
// function runAtSpecificTimeOfDay(hour, minutes, func)
// {
//   const twentyFourHours = 86400000;
//   const now = new Date();
//   let eta_ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes, 0, 0).getTime() - now;
//   if (eta_ms < 0)
//   {
//     eta_ms += twentyFourHours;
//   }
//   setTimeout(function() {
//     //run once
//     func();
//     // run every 24 hours from now on
//     setInterval(func, twentyFourHours);
//   }, eta_ms);
// }