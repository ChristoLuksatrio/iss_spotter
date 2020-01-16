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





module.exports = { fetchMyIP, fetchCoordsByIP };