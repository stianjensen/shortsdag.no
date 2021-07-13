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

      isItShortsWeather(weatherData, callback);
    }
  });
}

function getWeatherDataByCoords(lat, long, callback) {
  var url = 'http://api.met.no/weatherapi/locationforecast/1.9/?lat=' + lat + ';lon=' + long;
  request(url, function(error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode < 200 || response.statusCode >= 300) {
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

      isItShortsWeather(weatherData, callback);
    }
  });
}

function isItShortsWeather(data, callback) {
  // Symbol numbers documented here:
  // http://om.yr.no/forklaring/symbol/
  const rainNumbers = [40, 5, 41, 24, 6, 25, 42, 7, 43, 26, 20, 27, 46, 9, 10, 30, 22, 11, 47, 12, 48, 31, 23, 32];
  const snowNumbers = [44, 8, 45, 28, 21, 29, 49, 13, 50, 33, 14, 34];

  // Effective temperature above 15 and sunny
  if (data.effectiveTemperature >= 15 && data.symbol > 0 && data.symbol <= 3) {
    data.weather = 'shorts';
  }

  // Effective temperature above 18 and cloudy
  if (data.effectiveTemperature >= 18 && data.symbol == 4) {
    data.weather = 'shorts';
  }

  if (data.weather !== 'shorts') {
    if ((data.symbol > 0 && data.symbol <= 4) || data.symbol == 15) {
      if (data.effectiveTemperature <= 0) {
        data.weather = 'freezing';
      } else {
        data.weather = 'pants';
      }
    }
    if (rainNumbers.indexOf(+data.symbol) !== -1) {
      data.weather = 'rain';
    }
    if (snowNumbers.indexOf(+data.symbol) !== -1) {
      data.weather = 'snow';
    }
  }

  callback(null, data);
}

// Adapted from http://om.yr.no/forklaring/symbol/effektiv-temperatur/
function getEffectiveTemperature(temperature, windSpeed) {
  return 13.12 +
         0.6215 * temperature -
         11.37 * Math.pow(windSpeed, 0.16) +
         0.3965 * temperature * Math.pow(windSpeed, 0.16);
}
