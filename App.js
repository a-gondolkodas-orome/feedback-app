
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Welcome from './Welcome'
import { Question } from './Question.js';

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDmshJPEN5RyoQB5HI9f6vf4Ys7dn8Gkkw",
  projectId: "feedback-app-ago",
  authDomain: "feedback-app-ago.firebaseapp.com",
  databaseURL: "https://feedback-app-ago.firebaseio.com",
  storageBucket: "feedback-app-ago.appspot.com"
};

firebase.initializeApp(firebaseConfig);


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isShowingQuestion: false, questionDocSnap: null}
  }

  showQuestion = (questionDocSnap) => {
    console.log("Showing question: " + questionDocSnap.ref.path);
    this.setState({
      isShowingQuestion: true,
      questionDocSnap: questionDocSnap
    });
  }

  render() {
    if (this.state.isShowingQuestion) {
      return (
        <View style={styles.container}>
          <Question questionObject={this.state.questionDocSnap} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Welcome showQuestion={this.showQuestion}/>
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


