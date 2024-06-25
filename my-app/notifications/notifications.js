const severeWeatherAlertsAPIKey = "22KrLqgipPzjZyD6YRSg0S22mAmXsXUPxJtnFkleQBtYPwnppphXJQQJ99AFACYeBjFqD6kjAAAgAZMPlcTp";
var notifsInterval;

// Check toggle switch
$(document).ready(function(){
    $("#enable-notifs").click(function() {
        if ($("#enable-notifs").prop('checked') == true) {
            enableNotifs().then((areNotifsEnabled) => {
                if (areNotifsEnabled) {
                    console.log('Notifications are enabled:', areNotifsEnabled);
                } else {
                    $("#enable-notifs").prop('checked', false);
                }
            }).catch((error) => {
                console.log('An error occurred:', error);
            });
        } else {
            clearInterval(notifsInterval);
            console.log("Notifications are disabled.");
        }
    });
});

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
                        callNotifs();
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
                callNotifs();
                resolve(true);
            }
        }
    });
}

// Call notifications every hour (and when notifs are first turned on)
function callNotifs() {
    sendNotifs();
    notifsInterval = setInterval(sendNotifs, 3600000);
}

// Create & send out notifs
function sendNotifs() {
    getAlerts().then(alertData => {
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

// Receive alerts in proper format
function getAlerts() {
    return new Promise((resolve, reject) => {
        let alerts = [];
        getLocation()
            .then(currentCoords => getSevereAlerts(currentCoords.lat, currentCoords.lon))
            .then(severeAlerts => {
                alerts.push(...severeAlerts);
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
function getSevereAlerts(lat, lon) {
    const severeApiUrl = `https://atlas.microsoft.com/weather/severe/alerts/json?api-version=1.1&query=${lat},${lon}&subscription-key=${severeWeatherAlertsAPIKey}`;
    console.log("Getting severe alerts");
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
                console.log(data);
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