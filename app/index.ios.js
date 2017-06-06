import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableHighlight,
} from 'react-native';
import Credits from './credits';

const apiURL = 'https://shortsdag.no';

export default class Shortsdag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      forecast: null,
      modalVisible: false,
    };

    this.updateForecast();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  updateForecast() {
    const success = async pos => {
      const url = '/api/forecast/'
            + pos.coords.latitude +'/'
            + pos.coords.longitude + '/';
      const response = await fetch(apiURL + url);
      const data = await response.json();
      this.setState({forecast: data});
    };

    const error = async err => {
      const url = '/api/forecast/';
      const response = await fetch(apiURL + url);
      const data = await response.json();
      this.setState({forecast: data});
    };

    const options = {
      timeout: 5000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(success, error, options)
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({forecast: null});
      this.updateForecast();
    }
    this.setState({appState: nextAppState});
  };

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

        <TouchableHighlight
          onPress={() => { this.setModalVisible(true) }}
          style={styles.showModalButton}
          >
          <Text style={styles.showModalButtonText}>?</Text>
        </TouchableHighlight>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <Credits />
          <TouchableHighlight
            onPress={() => {this.setModalVisible(!this.state.modalVisible)}}
            style={styles.showModalButton}
            >
            <Text style={styles.showModalButtonText}>X</Text>
          </TouchableHighlight>
        </Modal>
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
  showModalButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  showModalButtonText: {
    lineHeight: 40,
    textAlign: 'center',
    color: '#ffffff',
  },
});

AppRegistry.registerComponent('Shortsdag', () => Shortsdag);
