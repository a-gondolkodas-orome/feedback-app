
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button } from 'react-native';
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

if (false) {
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
}



var email = "pitukgabor@gmail.com";
var name = "PGabor";


var submitAnswer = function(questionPath, answer) {
  db.collection(questionPath).add({
    answer: answer,
    email: email,
    name: name,
    timestamp: new Date()
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
};



class Scale5 extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    var buttons=[];
    for (i=1; i<=5; i++) {
      buttons.push(<CircularButtonForScaleAnswer key={i} title={i.toString()}/>);
    }

    return (
      <View style = {question_styles.scale5_container} >
        {buttons}
      </View>
    )
  }

}

class Scale10 extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    var buttons=[];
    for (i=1; i<=10; i++) {
      buttons.push(<CircularButtonForScaleAnswer key={i} title={i.toString()} radius={25} />);
    }

    return (
      <View style = {question_styles.scale10_container} >
        {buttons}
      </View>
    )
  }

}


class CircularButtonForScaleAnswer extends React.Component {

  constructor(props) {
    super(props);
    this.questionPath = "/events/alkototabor-20190706/questions/hogyvagy/answers";
  }

  onPress(answer) {
    submitAnswer(questionPath, answer);
  }

  render() {
    return (
      <TouchableOpacity
        title={this.props.title}
        style={question_styles.circular_button}
        onPress={() => {
          console.log(this.props.title);
          submitAnswer(this.questionPath, this.props.title);
        }}
      >
        <Text style={{color:'#000'}}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }

}




export class Question extends React.Component {
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
//    console.log(this.state);
    return (
      <View style={question_styles.container} >
        <Text style={question_styles.question_text} >{this.props.question}</Text>
        <Scale5/>
      </View>
    )
  }
}

const question_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  question_text: {
    position: 'absolute',
    top: 100,
    flex: 1,
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circular_button: {
    flex:1,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width: 40,
    height: 40,
    backgroundColor:'#fff',
    borderRadius: 20,
  },
  scale5_container: {
    position: 'absolute',
    top: 400,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scale10_container: {
    position: 'absolute',
    top: 400,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})


