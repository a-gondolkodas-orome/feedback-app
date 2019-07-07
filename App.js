
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';

import { Question } from './Question.js';

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View style={styles.container}>
        <Question question="Hogy érzed magad a táborban ?"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


