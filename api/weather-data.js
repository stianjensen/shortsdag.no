var XML = require('pixl-xml');
var request = require('request');

module.exports = {getWeatherData, getWeatherDataByCoords};

function getWeatherData(callback) {
  var url = 'http://www.yr.no/stad/Noreg/Sør-Trøndelag/Trondheim/Trondheim/varsel.xml';
  request(url, function(error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode != 200) {
      callback(new Error(response.statusCode));
    } else {
      var xmlDoc = XML.parse(body);
      var currentTimePeriod = xmlDoc.forecast.tabular.time[0];

      var temperature = currentTimePeriod.temperature.value;
      var windSpeed = currentTimePeriod.windSpeed.mps;
      var effectiveTemperature = getEffectiveTemperature(temperature, windSpeed);

      var weatherData = {
        temperature: Math.round(temperature),
        effectiveTemperature: Math.round(effectiveTemperature),
        windSpeed: windSpeed,
        windDirection: currentTimePeriod.windDirection.code,
        symbol: currentTimePeriod.symbol.number,
      };

      callback(null, weatherData);
    }
  });
}

function getWeatherDataByCoords(lat, long, callback) {
  var url = 'http://api.met.no/weatherapi/locationforecast/1.9/?lat=' + lat + ';lon=' + long;
  request(url, function(error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode != 200) {
      callback(new Error(response.statusCode));
    } else {
      var xmlDoc = XML.parse(body);
      var currentTimePeriod = xmlDoc.product.time[0].location;

      var temperature = currentTimePeriod.temperature.value;
      var windSpeed = currentTimePeriod.windSpeed.mps;
      var effectiveTemperature = getEffectiveTemperature(temperature, windSpeed);

      // Symbols are weird in the met.no API
      // The first time data-point doesn't seem to have symbol data,
      // but the next one usually does.
      var symbol = xmlDoc.product.time.filter(function(timePeriod) {
        return timePeriod.location.hasOwnProperty('symbol');
      })[0].location.symbol.number;

      var weatherData = {
        temperature: Math.round(temperature),
        effectiveTemperature: Math.round(effectiveTemperature),
        windSpeed: windSpeed,
        windDirection: currentTimePeriod.windDirection.name,
        symbol: symbol
      };

      callback(null, weatherData);
    }
  });
}

// Adapted from http://om.yr.no/forklaring/symbol/effektiv-temperatur/
function getEffectiveTemperature(temperature, windSpeed) {
  return 13.12 +
         0.6215 * temperature -
         11.37 * Math.pow(windSpeed, 0.16) +
         0.3965 * temperature * Math.pow(windSpeed, 0.16);
}
