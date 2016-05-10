(function(window) {
  // Symbol numbers documented here:
  // http://om.yr.no/forklaring/symbol/
  var rainNumbers = [40, 5, 41, 24, 6, 25, 42, 7, 43, 26, 20, 27, 46, 9, 10, 30, 22, 11, 47, 12, 48, 31, 23, 32];
  var snowNumbers = [44, 8, 45, 28, 21, 29, 49, 13, 50, 33, 14, 34];

  var url = '/api/forecast/';
  $.getJSON(url, function(data) {
    var shortsWeather = false;

    // Effective temperature above 15 and sunny
    if (data.effectiveTemperature >= 15 && data.symbol > 0 && data.symbol <= 3) {
      shortsWeather = true;
    }

    // Effective temperature above 18 and cloudy
    if (data.effectiveTemperature >= 18 && data.symbol == 4) {
      shortsWeather = true;
    }

    if (shortsWeather) {
      $('#content-wrapper').html($('#shortsday-true').html());
      $('body').addClass('shorts-weather');
    } else {
      $('#content-wrapper').html($('#shortsday-false').html());
      if ((data.symbol > 0 && data.symbol <= 4) || data.symbol == 15) {
        $('body').addClass('cold-weather');
      }
      if (rainNumbers.indexOf(data.symbol) !== -1) {
        $('body').addClass('rain-weather');
      }
      if (snowNumbers.indexOf(data.symbol) !== -1) {
        $('body').addClass('snow-weather');
      }
    }
  });
})(window);
