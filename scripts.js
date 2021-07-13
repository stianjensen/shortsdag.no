(function (window) {
  function renderWeather(data) {
    $("#content-wrapper").removeClass("loading");

    if (data.weather === "shorts") {
      $("#content-wrapper").html($("#shortsday-true").html());
      $("body").addClass("shorts-weather");
    } else {
      $("#content-wrapper").html($("#shortsday-false").html());
      if (data.weather === "freezing") {
        $("body").addClass("cold-weather");
      } else if (data.weather === "pants") {
        $("body").addClass("pants-weather");
      } else if (data.weather === "rain") {
        $("body").addClass("rain-weather");
        $("#video-background").attr("src", "/videos/rain.mp4");
      } else if (data.weather === "snow") {
        $("body").addClass("snow-weather");
        $("#video-background").attr("src", "/videos/snow.mp4");
      }
    }
  }

  function success(pos) {
    var url =
      "/api/forecast/" + pos.coords.latitude + "/" + pos.coords.longitude + "/";
    $.getJSON(url, renderWeather);
  }

  function error() {
    var url = "/api/forecast/59.9/10.7/";
    $.getJSON(url, renderWeather);
  }

  var options = {
    timeout: 5000,
    maximumAge: 60000,
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
})(window);
