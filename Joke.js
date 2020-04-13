import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import '@firebase/firestore';
import * as strings from './strings';

/* jokes: entry of the last and new joke (with first half displayed)
 * UPDATE_JOKE: loads the next joke to display into `jokes'
 */

export function loadNextJoke(currId) {
  const db = firebase.firestore();
  console.log("loading next joke, curr: " + currId);
  return db.collection("jokes").where("id", ">", currId).orderBy("id").limit(1)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty)
        return db.collection("jokes").orderBy("id").limit(1).get()
      else
        return querySnapshot
    })
    .then(querySnapshot => querySnapshot.docs[0].data())
}

function Joke(props) {
    // display last joke in full and first part of next joke
    return (
        <View style={styles.container}>
          <View style={Object.assign({}, styles.joke, {display: (props.jokes.last.first == "") ? 'none' : 'block'})}>
            <Text style={styles.textStyle}>
              {props.jokes.last.first}
            </Text>
            <Text style={styles.displaySecondPartStyle}>
              {props.jokes.last.second}
            </Text>
          </View>
          <View style={Object.assign({}, styles.joke, {display: (props.jokes.new.first == "") ? 'none' : 'block'})}>
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
    backgroundColor: '#0b1633',
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