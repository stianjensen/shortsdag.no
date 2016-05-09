(function(window) {
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
    } else {
      $('#content-wrapper').html($('#shortsday-false').html());
    }
  });
})(window);
