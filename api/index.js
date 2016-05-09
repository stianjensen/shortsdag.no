var express = require('express');
var libxmljs = require('libxmljs');
var request = require('request');


var app = express();

app.use(function(req, res, next) {
  if (req.url.substr(-1) != '/') {
    console.log('redirect');
    res.redirect(301, '/api' + req.url + '/');
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

app.get('/forecast/', function(req, res) {
  var url = 'http://www.yr.no/stad/Noreg/Sør-Trøndelag/Trondheim/Trondheim/varsel.xml';
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
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

      res.send(weatherData);
    } else {
      res.status(500).end();
    }
  })
});

app.listen(8999, function() {
  console.log('Started listening on port 8999');
});
