var express = require("express");
var weatherData = require("./weather-data");

var router = express.Router();

router.use(function (req, res, next) {
  if (req.url.substr(-1) != "/") {
    console.log("redirect");
    res.redirect(301, "/api" + req.url + "/");
  } else {
    next();
  }
});

router.use(function (req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});

router.get("/forecast/:lat/:long/", function (req, res) {
  weatherData.getWeatherDataByCoords(
    req.params.lat,
    req.params.long,
    function (error, data) {
      if (error) {
        console.error(error);
        res.status(500).end();
      } else {
        res.send(data);
      }
    }
  );
});

module.exports = router;
