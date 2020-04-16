
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import { saveAnswer } from './logic.js';
import * as strings from './strings';
import OnlineButton from './OnlineButton.js';


class WordCloud extends React.Component {

  // props: question: reference to parent Question component
  constructor(props) {
    super(props);
  }

  render() {
    var wordComponents=[];
    let i=1;
    for (wordId in this.props.question.questionObjectData.words) {
      wordComponents.push(
        <WordButtonForWordCloudAnswer key={i} title={this.props.question.questionObjectData.words[wordId]}
          question={this.props.question}
        />
      );
      i++;
    }

    return (
      <View style={question_styles.outer_container}>
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
      <OnlineButton
        style={question_styles.wordcloud_button}
        onPress={() => this.props.question.submitAnswer(this.props.title)}
      >
        <Text style={question_styles.button_text}>{this.props.title}</Text>
      </OnlineButton>
    )
  }
}


class Scale5 extends React.Component {

  // props: question: reference to parent Question component
  constructor(props) {
    super(props);
  }

  render() {
    var buttons=[];
    for (let i=1; i<=5; i++) {
      buttons.push(
        <CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />
      );
    }
    return (
      <View style={question_styles.outer_container}>
        <View style={question_styles.scale5_container} >
          {buttons}
        </View>
      </View>
    )
  }
}

class Scale10 extends React.Component {

  // props: question: reference to parent Question component
  constructor(props) {
    super(props);
  }

  render() {
    var buttons1=[], buttons2=[];
    for (let i=1; i<=5; i++) {
      buttons1.push(<CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />);
    }
    for (let i=6; i<=10; i++) {
      buttons2.push(<CircularButtonForScaleAnswer key={i} title={i.toString()} question={this.props.question} />);
    }

    return (
      <View style={question_styles.outer_container}>
        <View style={question_styles.scale10_container} >
          {buttons1}
        </View>
        <View style={question_styles.scale10_container} >
          {buttons2}
        </View>
      </View>
    )
  }
}


class CircularButtonForScaleAnswer extends React.Component {

  // props: question: reference to parent Question component
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <OnlineButton
        style={question_styles.circular_button}
        onPress={() => this.props.question.submitAnswer(this.props.title)}
      >
        <Text style={question_styles.button_text}>{this.props.title}</Text>
      </OnlineButton>
    )
  }
}


class TextBox extends React.Component {

  // props: question: reference to parent Question component
  constructor(props) {
    super(props);
    this.state = { answer: "" };
  }

  render() {
    return (
      <View style = {{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
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
        <OnlineButton
          style={question_styles.textbox_button}
          onPress={() => this.props.question.submitAnswer(this.state.answer)}
        >
          <Text style={question_styles.button_text}>Küld</Text>
        </OnlineButton>
        </View>
      </View>
    );
  }
}


class Question extends React.Component {

  constructor(props) {
    super(props);
  }

  submitAnswer(answer) {
    let answerObject = {
      answer: answer,
      name: this.props.name,
      timestamp: new Date()
    };
    saveAnswer(this.props.id, answerObject);
  }

  render() {
    console.log("Q: " + this.props.id);
    this.questionObjectData = this.props.questions[this.props.id].data;
    var questionComponentForType = (<Text style={question_styles.question_text}>{strings.UNKNOWN_QUESTION}</Text>);
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

const mapStateToProps = state => ({ 
  id: state.questionToShow,
  questions: state.questions,
  event: state.event,
  name: state.name
});

export default connect(mapStateToProps)(Question);

const question_styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  question_text: {
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    color: '#fff',
  },
  button_text: {
    color: '#fff',
    textAlign: 'center'
  },
  circular_button: {
    flex: 1,
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.5)',
    alignItems:'center',
    justifyContent:'center',
    width: 40,
    height: 40,
    backgroundColor:'#204096',
    color: '#fff',
    borderRadius: 20,
    margin: 5,
  },
  wordcloud_button: {
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.5)',
    alignItems:'center',
    justifyContent:'center',
    width: 150,
    padding: 8,
    backgroundColor:'#204096',
    color: '#fff',
    borderRadius: 20,
    margin: 5,
  },
  outer_container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textbox: {
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    width: 300,
    height: 80,
    justifyContent: 'center',
    padding: 8,
    margin: 20,
  },
  textbox_button: {
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.5)',
    alignItems:'center',
    justifyContent:'center',
    width: 100,
    height: 40,
    backgroundColor:'#204096',
    color: '#fff',
    borderRadius: 20,
    margin: 5,
  }
})

