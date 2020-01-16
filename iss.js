/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org/', function(error, response, body) {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    } else {
      callback(null, body);
    }
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const url = 'https://ipvigilante.com/' + ip;
  request(url, function(error, response, body) {
    if (error) {
      console.log('error');
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(msg, null);
      return;
    } else {
      let obj = JSON.parse(body).data;
      let data = {};
      data.latitude = obj.latitude;
      data.longitude = obj.longitude;
      callback(null, data);
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */


const fetchISSFlyOverTimes = (coords, callback) => {
  const url = 'http://api.open-notify.org/iss-pass.json?lat=' + coords.latitude + '&lon=' + coords.longitude;
  request(url, function(error, response, body) {
    if (error) {
      console.log('error');
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(msg, null);
    } else {
      let data = JSON.parse(body).response;
      callback(null, data);
    }
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(data, (error, data) => {
        if (error) {
          return callback(error,null)
        }

        callback(null, data);

      })
    })
  })
}



module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };