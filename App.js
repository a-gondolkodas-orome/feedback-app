
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
    // TODO: probably we should use Redux instead of this.
    this.state = {
      isShowingQuestion: false,
      questionDocSnap: null,
      name: null,
      eventDocSnap: null
    }
  }

  showQuestion = (questionDocSnap) => {
    console.log("Showing question: " + questionDocSnap.ref.path);
    this.setState({
      isShowingQuestion: true,
      questionDocSnap: questionDocSnap
    });
  }

  setName = (name) => {
    this.setState({ name: name });
  }

  setEvent = (eventDocSnap) => {
    this.setState({ eventDocSnap: eventDocSnap });
  }

  render() {
    if (this.state.isShowingQuestion) {
      return (
        <View style={styles.container}>
          <Text style={{marginTop: 40, fontSize: 24, color: "grey"}}>{this.state.eventDocSnap.data().name}</Text>
          <Question
            questionObject={this.state.questionDocSnap}
            name={this.state.name}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Welcome
          showQuestion={this.showQuestion}
          setName={this.setName}
          setEvent={this.setEvent}
        />
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


