import React, { Component } from 'react';
import {
  View,
  Text,
  Linking,
  StyleSheet,
} from 'react-native';

export default class Credits extends Component {
  goToURL = url => () => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
  };

  render() {
    return <View style={{margin: 20, marginTop: 80}}>
      <Text>
        Icon made by
        &thinsp;<Text style={styles.link} onPress={this.goToURL('http://www.flaticon.com/authors/roundicons')}>Roundicons</Text>&thinsp;
        from
        &thinsp;<Text style={styles.link} onPress={this.goToURL('http://www.flaticon.com')}>www.flaticon.com</Text>&thinsp;
        is licensed by
        &thinsp;<Text style={styles.link} onPress={this.goToURL('http://creativecommons.org/licenses/by/3.0/')}>CC 3.0 BY</Text>&thinsp;
      </Text>
      <Text>{'\n'}</Text>
      <Text style={styles.link} onPress={this.goToURL('https://shortsdag.no')}>
        https://shortsdag.no
      </Text>
    </View>;
  }
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    color: '#aabbff',
  }
});
