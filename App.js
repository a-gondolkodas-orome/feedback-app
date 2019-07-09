
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Welcome from './Welcome'
import Question from './Question';
import { createStore } from 'redux'
import feedbackReducer from './reducers'

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

const store = createStore(feedbackReducer);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.store = store;
    // TODO: probably we should use Redux instead of this.
    this.state = {
      isShowingQuestion: false,
      questionDocSnap: null,
    }
  }

  showQuestion = (questionDocSnap) => {
    console.log("Showing question: " + questionDocSnap.ref.path);
    this.setState({
      isShowingQuestion: true,
      questionDocSnap: questionDocSnap
    });
  }

  render() {
    if (this.store.getState().questionToShow != "") {
      return (
        <View style={styles.container}>
          <Text style={{marginTop: 40, fontSize: 24, color: "grey"}}>{store.getState().event.data.name}</Text>
          <Question
            store={this.store}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Welcome
          store={this.store}
          loadQuestions={this.loadQuestions.bind(this)}
        />
      </View>
    );
  }

  chooseQuestion() {
    // Just show the first wordcloud question.
    const ids = Object.keys(store.getState().questions)
    for (const id of ids) {
      const question = store.getState().questions[id];
      console.log(question);
      if (question.data.type.startsWith("word")) {
        store.dispatch({ type: 'SHOW_QUESTION', id: id });
      }
    }
  }

  loadQuestions() {
    let event = store.getState().event;
    var app = this;
    const db = firebase.firestore();
    db.collection("events").doc(event.id).collection("questions")
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.size == 0) {
          console.log("Did not find questions for event: " + eventRef.path);
          return;
        }
        for (const doc of querySnapshot.docs) {
          if (! (doc.id in store.getState().questions)) {
            store.dispatch({ type: 'ADD_QUESTION', id: doc.id, data: doc.data() });
          }
        }
        app.chooseQuestion();
      })
      .catch(function(error) {
        console.log("Error getting questions: ", error);
        // TODO: display error
      });
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


