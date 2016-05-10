var libxmljs = require('libxmljs');
var request = require('request');

module.exports.getWeatherData = getWeatherData;

function getWeatherData(callback) {
  var url = 'http://www.yr.no/stad/Noreg/Sør-Trøndelag/Trondheim/Trondheim/varsel.xml';
  request(url, function(error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode != 200) {
      callback(new Error(response.statusCode));
    } else {
      var xmlDoc = libxmljs.parseXml(body);

      var currentTimePeriod = xmlDoc.get('//tabular/time');

      var temperature = currentTimePeriod.get('temperature/@value').value();
      var windSpeed = currentTimePeriod.get('windSpeed/@mps').value();
      var effectiveTemperature = 13.12 +
                                 0.6215 * temperature -
                                 11.37 * Math.pow(windSpeed, 0.16) +
                                 0.3965 * temperature * Math.pow(windSpeed, 0.16);

      var weatherData = {
        temperature: Math.round(temperature),
        effectiveTemperature: Math.round(effectiveTemperature),
        windSpeed: windSpeed,
        windDirection: currentTimePeriod.get('windDirection/@code').value(),
        symbol: currentTimePeriod.get('symbol/@numberEx').value()
      };

      callback(null, weatherData);
    }
  });
}

module.exports.getWeatherDataByCoords = getWeatherDataByCoords;

function getWeatherDataByCoords(lat, long, callback) {
  var url = 'http://api.met.no/weatherapi/locationforecast/1.9/?lat=' + lat + ';lon=' + long;
  request(url, function(error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode != 200) {
      callback(new Error(response.statusCode));
    } else {
      var xmlDoc = libxmljs.parseXml(body);

      var currentTimePeriod = xmlDoc.get('//product/time/location');

      var temperature = currentTimePeriod.get('temperature/@value').value();
      var windSpeed = currentTimePeriod.get('windSpeed/@mps').value();
      var effectiveTemperature = 13.12 +
                                 0.6215 * temperature -
                                 11.37 * Math.pow(windSpeed, 0.16) +
                                 0.3965 * temperature * Math.pow(windSpeed, 0.16);

      // Symbols are weird in the met.no API
      // The first time data-point doesn't seem to have symbol data,
      // but the next one usually does.
      var symbol = xmlDoc.get('//product/time/location/symbol/@number').value();


      var weatherData = {
        temperature: Math.round(temperature),
        effectiveTemperature: Math.round(effectiveTemperature),
        windSpeed: windSpeed,
        windDirection: currentTimePeriod.get('windDirection/@name').value(),
        symbol: symbol
      };

      callback(null, weatherData);

    }
  });
}
