import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Welcome from './Welcome'
import Question from './Question'
import { store } from './reducers';
import { Notifications } from 'expo';
import { registerForPushNotificationsAsync } from './notif';
import Spinner from 'react-native-loading-spinner-overlay';

class Main extends React.Component {

    constructor(props) {
      super(props);
//      this.state = {
//        notification: {},
//      }
    }

    componentDidMount() {
      registerForPushNotificationsAsync();

      // Handle notifications that are received or selected while the app
      // is open. If the app was closed and then opened by tapping the
      // notification (rather than just tapping the app icon to open it),
      // this function will fire on the next tick after the app starts
      // with the notification data.
      this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = (notification) => {
      console.log(notification);

      let timestamp = (new Date()).getTime() + 1000; // rejtelyes modon lehet hogy ez hamarabbi mint a notification timestamp-je!? ezert a +1000ms

      const ids = Object.keys(store.getState().questions);
      for (const id of ids) {
        const question = store.getState().questions[id];
        if ((question.scheduledFor !== null) && (question.scheduledFor <= timestamp)) {
          store.dispatch({ type: 'MAKE_QUESTION_DUE', questionId: id });
        }
        else if (question.scheduledFor !== null) {
          // debugging
        }
      }

      if (store.getState().questionToShow === "")
        store.dispatch({ type: 'SHOW_NEXT_DUE_QUESTION' });

  };

  render() {
    if (this.props.questionToShow != "") {
      return (
        <View style={styles.container}>
          <Spinner
            visible={this.props.spinner}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
          <Text style={styles.eventTextStyle}>{this.props.event.data.name}</Text>
          <Question
            store={store}
          />
        </View>
      );
    }
    else if (this.props.event != null) {
      // TODO: this is almost same as above, try to refactor
      return (
        <View style={styles.container}>
          <Spinner
            visible={this.props.spinner}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
          <View style={{flex: 0.2, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.eventTextStyle}>{this.props.event.data.name}</Text>
            <TouchableOpacity
              style={styles.eventLeaveButton}
              onPress={() => store.dispatch({ type: "LEAVE_EVENT" })}
            >
              <Text style={{color:'#fff', fontSize: 20 }}>Kilépés a kísérletből</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.textStyle}>{this.props.noQuestionText}</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Spinner
            visible={this.props.spinner}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
        <Welcome
          store={store}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({ 
  event: state.event,
  questionToShow: state.questionToShow,
  spinner: state.spinner,
  noQuestionText: state.noQuestionText,
});

export default connect(mapStateToProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1633',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: '#fff'
  },
  textStyle: {
    marginTop: 30,
    fontSize: 24,
    color: '#fff',
    textAlign: "center",
    margin: 20,
  },
  eventTextStyle: {
    margin: 20,
    marginTop: 40,
    fontSize: 36,
    color: '#d3d3d3',
    textAlign: "center"
  },
  eventLeaveButton: {
    alignItems:'center',
    justifyContent:'center',
    borderWidth: 1,
    borderColor:'rgba(255,255,255,0.5)',
    width: 150,
    height: 500,
    backgroundColor:'#204096',
    color: '#fff',
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
  }
});

