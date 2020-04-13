import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as strings from './strings';

/* jokes: entry of the last and new joke (with first half displayed)
 * NEW_JOKE: loads the next joke to display into `jokes'
 */

function Joke(props) {
    // display last joke in full and first part of next joke
    return (
        <View>
          <View style={styles.container}>
            <Text style={styles.textStyle}>
              {props.jokes.last.first}
            </Text>
            <Text style={styles.displaySecondPartStyle}>
              {props.jokes.last.second}
            </Text>
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