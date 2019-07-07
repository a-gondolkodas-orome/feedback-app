
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';




var email = "pitukgabor@gmail.com";
var name = "PGabor";





class Scale5 extends React.Component {

// props: `question`: reference to Question component

  constructor(props) {
    super(props);
  }

  render() {

    var buttons=[];
    for (i=1; i<=5; i++) {
      buttons.push(<CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />);
    }

    return (
      <View style = {question_styles.scale5_container} >
        {buttons}
      </View>
    )
  }

}

class Scale10 extends React.Component {

// props: `question`: reference to Question component

  constructor(props) {
    super(props);
  }

  render() {

    var buttons=[];
    for (i=1; i<=10; i++) {
      buttons.push(<CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />);
    }

    return (
      <View style = {question_styles.scale10_container} >
        {buttons}
      </View>
    )
  }

}


class CircularButtonForScaleAnswer extends React.Component {

// props: `question`: reference to Question component


  constructor(props) {
    super(props);
//    this.questionPath = "/events/alkototabor-20190706/questions/hogyvagy/answers";
  }

  onPress = function() {
    console.log("Button pressed, sending answer: ", this.props.title);
    submitAnswer(this.props.title);
  }

  render() {
    return (
      <TouchableOpacity
        title={this.props.title}
        style={question_styles.circular_button}
        onPress={() => this.props.question.submitAnswer(this.props.title)}
      >
        <Text style={{color:'#000'}}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }

}



// <Question questionObject={QueryDocumentSnapshot} />

export class Question extends React.Component {

//  props: `questionObject`: firebase QueryDocumentSnapshot object

  constructor(props) {
    super(props);
    this.questionObjectData = this.props.questionObject.data();
  }

  submitAnswer(answer) {

    this.props.questionObject.ref.collection('answers').add({
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

  render() {
    if (this.questionObjectData.type == "scale5") {
      return (
        <View style={question_styles.container} >
          <Text style={question_styles.question_text} >{this.questionObjectData.text}</Text>
          <Scale5 question={this} />
        </View>
      )
    } else if (this.questionObjectData.type == "scale10") {
      return (
        <View style={question_styles.container} >
          <Scale10 question={this} />
        </View>
      )
    }
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


