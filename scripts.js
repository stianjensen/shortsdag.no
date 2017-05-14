(function(window) {
  function isItShortsWeather(data) {
    var shortsWeather = false;
    // Symbol numbers documented here:
    // http://om.yr.no/forklaring/symbol/
    var rainNumbers = [40, 5, 41, 24, 6, 25, 42, 7, 43, 26, 20, 27, 46, 9, 10, 30, 22, 11, 47, 12, 48, 31, 23, 32];
    var snowNumbers = [44, 8, 45, 28, 21, 29, 49, 13, 50, 33, 14, 34];

    // Effective temperature above 15 and sunny
    if (data.effectiveTemperature >= 15 && data.symbol > 0 && data.symbol <= 3) {
      shortsWeather = true;
    }

    // Effective temperature above 18 and cloudy
    if (data.effectiveTemperature >= 18 && data.symbol == 4) {
      shortsWeather = true;
    }

    $('#content-wrapper').removeClass('loading');
    if (shortsWeather) {
      $('#content-wrapper').html($('#shortsday-true').html());
      $('body').addClass('shorts-weather');
    } else {
      $('#content-wrapper').html($('#shortsday-false').html());
      if ((data.symbol > 0 && data.symbol <= 4) || data.symbol == 15) {
        if (data.effectiveTemperature <= 0) {
          $('body').addClass('cold-weather');
        } else {
          $('body').addClass('pants-weather');
        }
      }
      if (rainNumbers.indexOf(+data.symbol) !== -1) {
        $('body').addClass('rain-weather');
        $('#video-background').attr('src', '/videos/rain.mp4');
      }
      if (snowNumbers.indexOf(+data.symbol) !== -1) {
        $('body').addClass('snow-weather');
        $('#video-background').attr('src', '/videos/snow.mp4');
      }
    }
  }

  function success(pos) {
    var url = '/api/forecast/'
          + pos.coords.latitude +'/'
          + pos.coords.longitude + '/';
    $.getJSON(url, isItShortsWeather);
  }

  function error(err) {
    var url = '/api/forecast/';
    $.getJSON(url, isItShortsWeather);
  }

  var options = {
    timeout: 5000,
    maximumAge: 60000
  };

  navigator.geolocation.getCurrentPosition(success, error, options)
})(window);
