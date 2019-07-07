
import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';

export default class Welcome extends React.Component {

  constructor(props) {
    super(props);
    // Default values for easier debugging, they should be "" instead.
    this.state = { name: "N Laci", code: "1337" };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Feedback app</Text>
        <Text style={styles.label}>Kapcsolódás eseményhez</Text>
        <Text style={styles.label}>A neved:</Text>
        <TextInput
          ref={(input) => { this.nameTextInput = input; }}
          style={styles.textInput}
          onChangeText={(text) => this.setState({name: text})}
          value={this.state.name}
          autoCapitalize="words"
          autoCorrect={false}
          onSubmitEditing={() => { this.nameTextInput.focus(); }}
        />
        <Text style={styles.label}>Esemény kódja:</Text>
        <TextInput
          ref={(input) => { this.codeTextInput = input; }}
          style={styles.textInput}
          maxLength={5}
          onChangeText={(text) => this.setState({code: text})}
          value={this.state.code}
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={this.connectToEvent.bind(this)}
          style={styles.connectButton}
        >
          <Text style={{color: "white", fontSize: 24}}>Kapcsolódás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  connectToEvent() {
    if (this.state.name == "") {
      this.nameTextInput.focus();
      return;
    }
    if (this.state.code == "") {
      this.codeTextInput.focus();
      return;
    }

    const db = firebase.firestore();
    var welcome = this;

    db.collection("events").where("code", "==", welcome.state.code)
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.size != 1) {
          console.log("Did not find event: " + welcome.state.code);
          // TODO: maybe display error message
          welcome.setState({code: ""});
          welcome.codeTextInput.focus();
          return;
        }
        console.log("Found event: ", querySnapshot.docs[0].id, " => ", querySnapshot.docs[0].data());
        // Next step: jump to the event. For now we will just jump to a question of it.
        welcome.getQuestion(querySnapshot.docs[0].ref);
      })
      .catch(function(error) {
        console.log("Error getting event: ", error);
        // TODO: display error
      });
  }

  getQuestion(eventRef) {
    var welcome = this;
    eventRef.collection("questions")
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.size == 0) {
          console.log("Did not find questions for event: " + eventRef.path);
          return;
        }
        welcome.props.showQuestion(querySnapshot.docs[0]);
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
    margin: 10,
  },
  label: {
    height: 40,
    fontSize: 24,
  },
  textInput: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 30,
  },
  connectButton: {
    height: 50,
    alignItems: 'center',
    backgroundColor: '#24A0ED',
    padding: 10,
    margin: 10,
  }
});