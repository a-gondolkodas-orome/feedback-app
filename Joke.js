import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import ParsedText from 'react-native-parsed-text';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { store } from './reducers';
import * as actions from './actions';

/* jokes: entry of the last, the new joke (with first half displayed)
 * jokeInfo: which description is visible in the WebView
 * and the colleciton of remaining jokes
 * ADD_JOKES: adds an array of jokes into `jokes.collection'
 * UPDATE_JOKE: loads the next joke to display into `jokes'
 * SET_JOKE_INFO: jokeInfo setter
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
  // Reset jokeInfo
  store.dispatch(actions.setJokeInfo(""));
  // Update joke
  store.dispatch(actions.updateJoke());
  // If no more jokes, load them again
  if (Object.keys(store.getState().jokes.collection).length == 0) {
    loadAllJokes();
  }
}


class Joke extends React.Component {

  constructor(props) {
    super(props)
  }

  showInfo = (info, matchIndex) => {
    store.dispatch(actions.setJokeInfo(info))
    // Scroll down -- for some reason this waits for render to complete
    setTimeout(() => this.props.scrollDown(), 0);
  }

  hideInfo = () => {
    // Scroll up smoothly
    this.props.scrollUp();
    // and hide WebView
    setTimeout(() => store.dispatch(actions.setJokeInfo("")), 200)
  }

  render() {
    // display last joke in full and first part of next joke
    return (
        <View>
        <View style={styles.container}>
          <View style={this.props.jokes.last.first == "" ? {display: 'none'} : styles.joke}>
            <ParsedText
              style={styles.textStyle}
              parse={[{
                pattern: /^(csacsi-pacsi)|^(Rosszul összetett szavak)/,
                style: styles.infoWord,
                onPress: this.showInfo
              }]}
              >
                {this.props.jokes.last.first}
              </ParsedText>
            <Text style={styles.displaySecondPartStyle}>
                {this.props.jokes.last.second}
              </Text>
          </View>
          <View style={this.props.jokes.new.first == "" ? {display: 'none'} : styles.joke}>
            <ParsedText
              style={styles.textStyle}
              parse={[{
                pattern: /^(csacsi-pacsi)|^(Rosszul összetett szavak)/,
                style: styles.infoWord,
                onPress: this.showInfo
              }]}>
                {this.props.jokes.new.first}
              </ParsedText>
            <Text style={styles.missingSecondPartStyle}>
              ???
            </Text>
          </View>
        </View>
        <View style={this.props.jokeInfo == "" ? {display: 'none'} : {}}>
          <Text
            style={styles.scrollUpButtonStyle}
            onPress={this.hideInfo}>
              Elrejt
            </Text>
          <WebView
           source = {{ uri: this.props.jokeInfo == "csacsi-pacsi" ?
            'https://hu.wikipedia.org/wiki/Csacsipacsi'
          : 'https://hu.wikipedia.org/wiki/Rosszul_összetett_szavak' }}
           style={styles.webViewStyle}
           />
          </View>
        </View>
      );
  }
}

const mapStateToProps = state => ({ 
  spinner: state.spinner,
  jokes: state.jokes,
  jokeInfo: state.jokeInfo
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
  },
  webViewStyle: {
    height: Dimensions.get('screen').height - 150,
  },
  infoWord: {
    color: '#0645AD',
    textDecorationLine: 'underline'
  },
  scrollUpButtonStyle: {
    textAlign: "left",
    fontSize: 18,
    color: '#b3b3b3',
    padding: 15,
    marginTop: 10
  }
});