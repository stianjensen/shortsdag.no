import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class Shortsdag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forecast: null
    };

    const success = pos => {
      const url = '/api/forecast/'
            + pos.coords.latitude +'/'
            + pos.coords.longitude + '/';
      fetch('http://localhost:8999' + url)
        .then(response => response.json())
        .then(data => {
          this.setState({forecast: data});
        });
    };

    const error = err => {
      const url = '/api/forecast/';
      fetch('http://localhost:8999' + url)
        .then(response => response.json())
        .then(data => {
          this.setState({forecast: data});
        });
    };

    const options = {
      timeout: 5000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(success, error, options)
  }

  render() {
    let forecastImage, forecastText;
    if (this.state.forecast) {
      const weather = this.state.forecast.weather;
      if (weather === 'shorts') {
        forecastImage = require('./images/bg_shorts.jpg');
        forecastText = 'Det er shortsdag!';
      } else if (weather === 'pants') {
        forecastImage = require('./images/bg_pants.jpg');
        forecastText = 'Det er ikke shortsdag :('
      } else if (weather === 'freezing') {
        forecastImage = require('./images/bg_cold.jpg');
        forecastText = 'Det er ikke shortsdag :('
      } else if (weather === 'snow') {
        forecastImage = require('./images/bg_snow.jpg');
        forecastText = 'Det er ikke shortsdag :('
      } else if (weather === 'rain') {
        forecastImage = require('./images/bg_rain.jpg');
        forecastText = 'Det er ikke shortsdag :('
      }
    }

    return (
      <View style={styles.container}>
        { this.state.forecast
          ? <Image style={styles.background} source={forecastImage}>
              <Text style={styles.shortsdag}>
                {forecastText}
              </Text>
            </Image>
          : <Text style={styles.loading}>
              Kikker ut vinduet...
            </Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  loading: {
    margin: 10,
    fontSize: 30,
    textAlign: 'center',
  },
  shortsdag: {
    fontSize: 30,
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  notshortsdag: {
    fontSize: 30,
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

AppRegistry.registerComponent('Shortsdag', () => Shortsdag);
