var request = require("request");

module.exports = { getWeatherDataByCoords };

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
      var weather = JSON.parse(body);
      var currentTimePeriod =
        weather.properties.timeseries[0].data.instant.details;

      var temperature = currentTimePeriod.air_temperature;
      var windSpeed = currentTimePeriod.wind_speed;
      var effectiveTemperature = getEffectiveTemperature(
        temperature,
        windSpeed
      );

      const fullSymbol =
        weather.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
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
  // https://api.met.no/weatherapi/weathericon/2.0/documentation
  const rainSymbols = [
    "heavyrain",
    "heavyrainandthunder",
    "heavyrainshowers",
    "heavyrainshowersandthunder",
    "heavysleet",
    "heavysleetandthunder",
    "heavysleetshowers",
    "heavysleetshowersandthunder",
    "lightrain",
    "lightrainandthunder",
    "lightrainshowers",
    "lightrainshowersandthunder",
    "lightsleet",
    "lightsleetandthunder",
    "lightsleetshowers",
    "lightsleetshowersandthunder",
    "rain",
    "rainandthunder",
    "rainshowers",
    "rainshowersandthunder",
    "sleet",
    "sleetandthunder",
    "sleetshowers",
    "sleetshowersandthunder",
  ];
  const snowSymbols = [
    "heavysnow",
    "heavysnowandthunder",
    "heavysnowshowers",
    "heavysnowshowersandthunder",
    "lightsnow",
    "lightsnowandthunder",
    "lightsnowshowers",
    "lightsnowshowersandthunder",
    "snow",
    "snowandthunder",
    "snowshowers",
    "snowshowersandthunder",
  ];

  const sunnySymbols = ["partlycloudy", "clearsky", "fair"];

  // Effective temperature above 15 and sunny
  if (data.effectiveTemperature >= 15 && sunnySymbols.includes(data.symbol)) {
    data.weather = "shorts";
  }

  // Effective temperature above 18 and cloudy
  if (data.effectiveTemperature >= 18 && data.symbol == "cloudy") {
    data.weather = "shorts";
  }

  if (data.weather !== "shorts") {
    if (
      sunnySymbols.includes(data.symbol) ||
      data.symbol == "cloudy" ||
      data.symbol == "fog"
    ) {
      if (data.effectiveTemperature <= 0) {
        data.weather = "freezing";
      } else {
        data.weather = "pants";
      }
    }
    if (rainSymbols.includes(data.symbol)) {
      data.weather = "rain";
    }
    if (snowSymbols.includes(data.symbol)) {
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
