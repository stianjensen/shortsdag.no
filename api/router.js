var express = require('express');
var weatherData = require('./weather-data');

var router = express.Router();

router.use(function(req, res, next) {
  if (req.url.substr(-1) != '/') {
    console.log('redirect');
    res.redirect(301, '/api' + req.url + '/');
  } else {
    next();
  }
});

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});


router.get('/', function(req, res) {
  weatherData.getWeatherData(function(error, data) {
    if (error) {
      res.status(500).end();
    } else {
      var shortsWeather = false;

      // Effective temperature above 15 and sunny
      if (data.effectiveTemperature >= 15 && data.symbol > 0 && data.symbol <= 3) {
        shortsWeather = true;
      }

      // Effective temperature above 18 and cloudy
      if (data.effectiveTemperature >= 18 && data.symbol == 4) {
        shortsWeather = true;
      }

      res.send({shortsWeather: shortsWeather});
    }
  });
});

router.get('/forecast/', function(req, res) {
  weatherData.getWeatherData(function(error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.send(data);
    }
  });
});

router.get('/forecast/:lat/:long/', function(req, res) {
  weatherData.getWeatherDataByCoords(req.params.lat, req.params.long, function(error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
