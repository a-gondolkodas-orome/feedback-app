
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableWithoutFeedback,
 Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { loadQuestions } from './logic';
import { loadAllJokes } from './Joke';
import { store } from './reducers';
import { setEvent, spinnerOn, spinnerOff } from './actions';
import { WELCOME_TEXT } from './strings'
import OnlineButton from './OnlineButton';

class Welcome extends React.Component {

  constructor(props) {
    super(props);
    // Default value for easier debugging, it should be "" instead.
    // TODO: connect this instead with the eventCode in the store.
    this.state = { code: "1111", year: "", city: "", school: "" };
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Text style={styles.appNameTextStyle}>Feedback App</Text>
            <ScrollView>
              <Text style={styles.info}>{WELCOME_TEXT}</Text>
              <Text style={styles.info}>Kérlek add meg a következőket!</Text>
              <Text style={styles.label}>Esemény kódja:</Text>
              <TextInput
                ref={(input) => { this.codeTextInput = input; }}
                style={styles.textInput}
                maxLength={5}
                onChangeText={(text) => this.setState({code: text})}
                value={this.state.code}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => this.yearTextInput.focus()}
              />
              <Text style={styles.label}>Évfolyam:</Text>
              <TextInput
                ref={(input) => { this.yearTextInput = input; }}
                style={styles.textInput}
                onChangeText={(text) => this.setState({year: text})}
                value={this.state.year}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => this.cityTextInput.focus()}
              />
              <Text style={styles.label}>Város:</Text>
              <TextInput
                ref={(input) => { this.cityTextInput = input; }}
                style={styles.textInput}
                onChangeText={(text) => this.setState({city: text})}
                value={this.state.city}
                keyboardType="default"
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={() => this.schoolTextInput.focus()}
              />
              <Text style={styles.label}>Iskola (nem kötelező):</Text>
              <TextInput
                ref={(input) => { this.schoolTextInput = input; }}
                style={styles.textInput}
                onChangeText={(text) => this.setState({school: text})}
                value={this.state.school}
                keyboardType="default"
                returnKeyType="send"
                autoCorrect={false}
                onSubmitEditing={this.connectToEvent.bind(this)}
              />
              <OnlineButton
                onPress={this.connectToEvent.bind(this)}
                style={styles.connectButton}
              >
                <Text style={{color: "white", fontSize: 24}}>Kapcsolódás</Text>
              </OnlineButton>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  connectToEvent() {
    console.log(this.state);
    console.log("name:", store.getState().name);

    if (this.state.code == "") {
      this.codeTextInput.focus();
      // TODO: red border
      return;
    }

    if (this.state.year == "") {
      this.yearTextInput.focus();
      // TODO: red border
      return;
    }

    if (this.state.city == "") {
      this.cityTextInput.focus();
      // TODO: red border
      return;
    }

    store.dispatch(spinnerOn());

    // TODO: move the below code to logic.js with some error returned.
    const db = firebase.firestore();
    var welcome = this;

    db.collection("events").where("code", "==", welcome.state.code)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size < 1) {
          throw new Error("Did not find event: " + welcome.state.code);
        }
        if (querySnapshot.size > 1) {
          console.log("Found multiple events: ");
          querySnapshot.docs.forEach(doc => console.log(doc.id, "=>", doc.data()));
          console.log("Choosing the first one of them...");
        }
        return { id: querySnapshot.docs[0].id, data: querySnapshot.docs[0].data() };
      })
      .then((event) => {
        console.log("Selected event: ", event);
        store.dispatch(setEvent(event));
      })
      .then(() => {
        // Load questions of the event
        // Note: `loadQuestions' turns off spinner
        loadQuestions();
        // Load jokes initially, if we run out we load them again later
        loadAllJokes();
      })
      .catch((error) => {
        // TODO: maybe display error message
        console.log("Error getting event: ", error);
        welcome.setState({code: ""});
        store.dispatch(spinnerOff());
        welcome.codeTextInput.focus();
      })
      .then(() => {
        // Register user data only if we entered the event successfully
        let data = {
          year: parseInt(this.state.year),
          city: this.state.city,
          school: this.state.school,
          name: store.getState().name
        }
        console.log("registering ...", data)
        return db.collection("users").doc(store.getState().name).set(data)
      })
      .then(() => console.log("user registered successfully"))
      .catch(console.log)
  }
}

const mapStateToProps = state => ({
  event: state.event
});

export default connect(mapStateToProps)(Welcome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    padding: 15,
  },
  info: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
  },
  label: {
    fontSize: 20,
    marginTop: 10,
    color: '#d3d3d3',
    textAlign: "center"
  },
  appNameTextStyle: {
    margin: 10,
    padding: 5,
    fontSize: 30,
    color: '#d3d3d3',
    textAlign: "center"
  },
  textInput: {
    height: 50,
    borderColor: 'transparent',
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
    marginTop: 20,
    borderRadius: 10
  }
});