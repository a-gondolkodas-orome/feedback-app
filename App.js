
import React from 'react';
import { StyleSheet, Text, TextInput, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDmshJPEN5RyoQB5HI9f6vf4Ys7dn8Gkkw",
  projectId: "feedback-app-ago",
  authDomain: "feedback-app-ago.firebaseapp.com",
  databaseURL: "https://feedback-app-ago.firebaseio.com",
  storageBucket: "feedback-app-ago.appspot.com"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


db.collection("/events/alkototabor-20190706/questions/hogyvagy/answers").add({
    answer: "3",
    email: "pitukgabor@gmail.com",
    name: "PGabor",
    timestamp: new Date()
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});




class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: ''
    };
  }

  saveAnswer = (text) => {
    this.setState({answer: text})
  }

  submitAnswer = (event) => {
    console.log("Sending answer to server.")
  }

  render() {
    console.log(this.state);
    return (
      <>
        <Text>{this.props.question}</Text>
        <TextInput
          placeholder="Válasz."
          onChangeText = {this.saveAnswer}
        />
        <Button
          title="ClickMe!"
          onPress = {this.submitAnswer}
        />

        <Text>(A válaszod: this.state.answer)</Text>
      </>
    )
  }
}


export default class App extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>Lorem ipsum!</Text>
        <Question question="Hogy vagy?"/>
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

