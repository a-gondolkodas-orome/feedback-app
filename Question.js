
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';




class WordCloud extends React.Component {

// props: `question`: reference to parent Question component

  constructor(props) {
    super(props);
  }

  render() {

    var wordComponents=[];
    var i=1;
    console.log(this.props.question.questionObjectData);
    for (wordId in this.props.question.questionObjectData.words) {
      wordComponents.push(
        <WordButtonForWordCloudAnswer key={i} title={this.props.question.questionObjectData.words[wordId]}
          question={this.props.question}
        />
      );
      i++;
    }

    return (
      <View style = {{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <View style={question_styles.wordcloud_container} >
          {wordComponents}
        </View>
      </View>
    )

  }

}


class WordButtonForWordCloudAnswer extends React.Component {

  render() {
    return (
      <TouchableOpacity
        title={this.props.title}
        style={question_styles.wordcloud_button}
        onPress={() => this.props.question.submitAnswer(this.props.title)}
      >
        <Text style={{
          color: '#000',
          textAlign: 'center'
        }}>
        {this.props.title}</Text>
      </TouchableOpacity>
    )
  }


}


class Scale5 extends React.Component {

// props: `question`: reference to parent Question component

  constructor(props) {
    super(props);
  }

  render() {

    var buttons=[];
    for (i=1; i<=5; i++) {
      buttons.push(
        <CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />
      );
    }

    return (
      <View style = {{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <View style = {question_styles.scale5_container} >
          {buttons}
        </View>
      </View>
    )
  }

}

class Scale10 extends React.Component {

// props: `question`: reference to parent Question component

  constructor(props) {
    super(props);
  }

  render() {

    var buttons1=[], buttons2=[];
    for (i=1; i<=5; i++) {
      buttons1.push(<CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />);
    }
    for (i=6; i<=10; i++) {
      buttons2.push(<CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />);
    }

    return (
      <View style = {{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <View style = {question_styles.scale10_container} >
          {buttons1}
        </View>
        <View style = {question_styles.scale10_container} >
          {buttons2}
        </View>
      </View>
    )
  }

}


class CircularButtonForScaleAnswer extends React.Component {

// props: `question`: reference to parent Question component

  constructor(props) {
    super(props);
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



class TextBox extends React.Component {

// props: `question`: reference to parent Question component
  
  constructor(props) {
    super(props);
    this.state = { answer: "" };
  }

  render() {
    return (
      <View style = {{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <View style={question_styles.textbox_container} >
          <TextInput
            style={question_styles.textbox}
            placeholder="Rövid válasz."
            multiline={true}
            blurOnSubmit={true}
            onChangeText={(text) => this.setState({answer: text})}
            value={this.state.answer}
          />
        <TouchableOpacity
          style={question_styles.textbox_button}
          onPress={() => this.props.question.submitAnswer(this.state.answer)}
        >
          <Text style={{color:'#000'}}>Küld</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

}


export class Question extends React.Component {

//  props: `store`: redux store

  constructor(props) {
    super(props);
    this.id = this.props.store.getState().questionToShow;
    this.questionObjectData = this.questions[id];
  }

  submitAnswer(answer) {
    let answerObject = {
      answer: answer,
      // email: email,
      name: this.props.store.getState().name,
      timestamp: new Date()
    };
    const db = firebase.firestore();
    db/* TODO: get question here */.collection('answers')
      .add(answerObject)
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id, " data: ", answerObject);
          // TODO: here comes the ADD_ANSWER action
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  };

  render() {
    var questionComponentForType = (<Text>Ismeretlen kérdéstípus</Text>);
    if (this.questionObjectData.type == "scale5") {
      questionComponentForType = (<Scale5 question={this} />);
    } else if (this.questionObjectData.type == "scale10") {
      questionComponentForType = (<Scale10 question={this} />);
    } else if (this.questionObjectData.type == "wordcloud") {
      questionComponentForType = (<WordCloud question={this} />);
    } else if (this.questionObjectData.type == "textbox") {
      questionComponentForType = (<TextBox question={this} />);
    }
    return (
      <View style={question_styles.container} >
          <Text style={question_styles.question_text} >{this.questionObjectData.text}</Text>
          {questionComponentForType}
      </View>
    );
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
    marginTop: 100,
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  circular_button: {
    flex: 1,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width: 40,
    height: 40,
    backgroundColor:'#fff',
    borderRadius: 20,
    margin: 5,
  },
  wordcloud_button: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width: 150,
    padding: 8,
    backgroundColor:'#fff',
    borderRadius: 20,
    margin: 5,
  },
  wordcloud_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scale5_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  scale10_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  textbox_container: {
//    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textbox: {
//    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    width: 300,
    height: 80,
    justifyContent: 'center',
    padding: 8,
    margin: 20,
  },
  textbox_button: {
//    flex: 1,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width: 100,
    height: 40,
    backgroundColor:'#fff',
    borderRadius: 20,
    margin: 5,
  }
})

