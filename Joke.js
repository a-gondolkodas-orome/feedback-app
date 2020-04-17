import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { store } from './reducers';
import * as actions from './actions';

/* jokes: entry of the last, the new joke (with first half displayed)
 * and the colleciton of remaining jokes
 * ADD_JOKES: adds an array of jokes into `jokes.collection'
 * UPDATE_JOKE: loads the next joke to display into `jokes'
 */

export function loadAllJokes() {
  const db = firebase.firestore();
  console.log("loading all jokes");
  db.collection("jokes").get()
    .then(querySnapshot => {
      let jokes = new Array();
      querySnapshot.forEach(joke => {
        jokes.push({id: joke.id, data: joke.data()})
      });
      return jokes;
    })
    .then(actions.addJokes)
    .then(store.dispatch)
    .catch(console.error);
}

export function activateNextJoke() {
  console.log("activating next joke");
  store.dispatch(actions.updateJoke());
  if (Object.keys(store.getState().jokes.collection).length == 0) {
    loadAllJokes();
  }
}

function Joke(props) {
    // display last joke in full and first part of next joke
    return (
        <View style={styles.container}>
          <View style={props.jokes.last.first == "" ? {display: 'none'} : styles.joke}>
            <Text style={styles.textStyle}>
              {props.jokes.last.first}
            </Text>
            <Text style={styles.displaySecondPartStyle}>
              {props.jokes.last.second}
            </Text>
          </View>
          <View style={props.jokes.new.first == "" ? {display: 'none'} : styles.joke}>
            <Text style={styles.textStyle}>
              {props.jokes.new.first}
            </Text>
            <Text style={styles.missingSecondPartStyle}>
              ???
            </Text>
          </View>
        </View>
      );
}

const mapStateToProps = state => ({ 
  spinner: state.spinner,
  jokes: state.jokes,
});

export default connect(mapStateToProps)(Joke);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  joke: {
    width: '90%',
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'white',
  },
  textStyle: {
    marginTop: 30,
    fontSize: 24,
    color: '#fff',
    textAlign: "center",
    margin: 20,
  },
  missingSecondPartStyle: {
    marginTop: 30,
    fontSize: 24,
    color: '#ff0000',
    textAlign: "center",
    margin: 20,
  },
  displaySecondPartStyle: {
    marginTop: 30,
    fontSize: 24,
    color: '#00ff00',
    textAlign: "center",
    margin: 20,
  }
});