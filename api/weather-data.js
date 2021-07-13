var XML = require("pixl-xml");
var request = require("request");

module.exports = { getWeatherData, getWeatherDataByCoords };

function getWeatherData(callback) {
  var url =
    "http://www.yr.no/stad/Noreg/Sør-Trøndelag/Trondheim/Trondheim/varsel.xml";
  request(url, function (error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode != 200) {
      callback(new Error(response.statusCode));
    } else {
      var xmlDoc = XML.parse(body);
      var currentTimePeriod = xmlDoc.forecast.tabular.time[0];

      var temperature = currentTimePeriod.temperature.value;
      var windSpeed = currentTimePeriod.windSpeed.mps;
      var effectiveTemperature = getEffectiveTemperature(
        temperature,
        windSpeed
      );

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
  var url =
    "https://api.met.no/weatherapi/locationforecast/2.0/?lat=" +
    lat +
    "&lon=" +
    long;
  const options = {
    url,
    headers: {
      "User-Agent": "shortsdag.no github.com/stianjensen/shortsdag.no",
    },
  };
  request(options, function (error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode < 200 || response.statusCode >= 300) {
      callback(new Error(response.statusCode));
    } else {
      var xmlDoc = JSON.parse(body);
      console.log(
        "xmldoc",
        xmlDoc,
        xmlDoc.properties.timeseries[0].data.instant.details
      );
      var currentTimePeriod =
        xmlDoc.properties.timeseries[0].data.instant.details;

      var temperature = currentTimePeriod.air_temperature;
      var windSpeed = currentTimePeriod.wind_speed;
      var effectiveTemperature = getEffectiveTemperature(
        temperature,
        windSpeed
      );

      const fullSymbol =
        xmlDoc.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
      const symbol = fullSymbol.split("_")[0];

      var weatherData = {
        temperature: Math.round(temperature),
        effectiveTemperature: Math.round(effectiveTemperature),
        windSpeed: windSpeed,
        windDirection: currentTimePeriod.wind_direction,
        symbol: symbol,
      };

      isItShortsWeather(weatherData, callback);
    }
  });
}

function isItShortsWeather(data, callback) {
  // Symbol numbers documented here:
  // http://om.yr.no/forklaring/symbol/
  const rainNumbers = [
    "lightrainshowers",
    "rainshowers",
    41,
    24,
    6,
    25,
    42,
    7,
    43,
    26,
    20,
    27,
    46,
    9,
    10,
    30,
    22,
    11,
    47,
    12,
    48,
    31,
    23,
    32,
  ];
  const snowNumbers = [44, 8, 45, 28, 21, 29, 49, 13, 50, 33, 14, 34];

  const sunnyNumbers = ["partlycloudy", "clearsky", "fair"];

  // Effective temperature above 15 and sunny
  if (data.effectiveTemperature >= 15 && sunnyNumbers.includes(data.symbol)) {
    data.weather = "shorts";
  }

  // Effective temperature above 18 and cloudy
  if (data.effectiveTemperature >= 18 && data.symbol == "cloudy") {
    data.weather = "shorts";
  }

  if (data.weather !== "shorts") {
    if (
      sunnyNumbers.includes(data.symbol) ||
      data.symbol == "cloudy" ||
      data.symbol == "fog"
    ) {
      if (data.effectiveTemperature <= 0) {
        data.weather = "freezing";
      } else {
        data.weather = "pants";
      }
    }
    if (rainNumbers.includes(data.symbol)) {
      data.weather = "rain";
    }
    if (snowNumbers.includes(data.symbol)) {
      data.weather = "snow";
    }
  }

  callback(null, data);
}

// Adapted from http://om.yr.no/forklaring/symbol/effektiv-temperatur/
function getEffectiveTemperature(temperature, windSpeed) {
  return (
    13.12 +
    0.6215 * temperature -
    11.37 * Math.pow(windSpeed, 0.16) +
    0.3965 * temperature * Math.pow(windSpeed, 0.16)
  );
}
