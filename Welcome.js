
import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { loadQuestions } from './logic';
import { store } from './reducers';
import { setEvent, spinnerOff } from './actions';

class Welcome extends React.Component {

  constructor(props) {
    super(props);
    // Default value for easier debugging, it should be "" instead.
    // TODO: connect this instead with the eventCode in the store.
    this.state = { code: "1111" };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{height: 30, fontSize: 24, color: '#d3d3d3'}}>Feedback App</Text>
        <Text style={styles.label}>Kapcsolódás eseményhez</Text>
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
    if (this.state.code == "") {
      this.codeTextInput.focus();
      // TODO: red border
      return;
    }

    store.dispatch(spinnerOff());

    // TODO: move the below code to logic.js with some error returned.
    const db = firebase.firestore();
    var welcome = this;

    db.collection("events").where("code", "==", welcome.state.code)
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.size < 1) {
          console.log("Did not find event: " + welcome.state.code);
          // TODO: maybe display error message
          welcome.setState({code: ""});
          welcome.codeTextInput.focus();
          store.dispatch(spinnerOff());
          return;
        }
        if (querySnapshot.size < 1) {
          console.log("Found multiple events: ");
          for (let i = 0; i < querySnapshot.size; i++) {
            console.log(querySnapshot.docs[0].id, " => ", querySnapshot.docs[0].data());
          }
          console.log("Choosing the first one of them...");
        }
        let event = { id: querySnapshot.docs[0].id, data: querySnapshot.docs[0].data() };
        console.log("Selected event: ", event);
        store.dispatch(setEvent(event));
        loadQuestions();
      })
      .catch(function(error) {
        console.log("Error getting event: ", error);
        // TODO: display error
        store.dispatch(spinnerOff());
    });
  }
}

const mapStateToProps = state => ({
  event: state.event
});

export default connect(mapStateToProps)(Welcome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1633',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  label: {
    height: 30,
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
  },
  textInput: {
    height: 50,
    borderColor: '#0b1633',
    borderBottomColor: '#fff',
    color: '#fff',
    borderWidth: 1,
    fontSize: 28,
    minWidth: 150,
    textAlign: "center",
  },
  connectButton: {
    height: 50,
    alignItems: 'center',
    backgroundColor: '#24A0ED',
    borderColor: '#fff',
    padding: 10,
    margin: 10,
  }
});