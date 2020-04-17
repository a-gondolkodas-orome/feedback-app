import React from 'react';
import { AppState } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Main from './Main';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './reducers'
import { Notifications } from 'expo';
import { registerForNotificationsAsync } from './notif';
import { showFirst, setName } from './actions';
import GoogleServices from './google-services.json';

// The following code is just to disable some annoying warnings in expo.
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { spinnerOff } from './actions';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

// Initialize Firebase
const firebaseConfig = {
  apiKey: GoogleServices.client[0].api_key[0].current_key,
  projectId: GoogleServices.project_info.project_id,
  authDomain: "feedback-app-ago.firebaseapp.com",
  databaseURL: GoogleServices.project_info.firebase_url,
  storageBucket: GoogleServices.project_info.storage_bucket
};

firebase.initializeApp(firebaseConfig);

firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  console.log("Sign in:", error.code, error.message);
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Sign in:", user.uid);
    // User is signed in.
    store.dispatch(setName(user.uid));
  } else {
    // User is signed out.
    console.log("Sign out:", user);
  }
});

// TODO: the code below enables offline data storage, it doesn't work with Expo
/*
firebase.firestore().enablePersistence()
  .catch(function(err) {
    console.log("Error enabling firestore offline persistence: ", err);
});
*/

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    registerForNotificationsAsync();
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);

  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      store.dispatch(spinnerOff());
      this.checkAndShowQuestion(false);
    }
    this.setState({appState: nextAppState});
  };

  _handleNotification = (notification) => {
    console.log(notification);
    this.checkAndShowQuestion(notification.origin == 'selected');
  };

  checkAndShowQuestion(forced) {
    if (store.getState().event == null) return;
    const firstQuestionData = store.getState().questions[store.getState().firstQuestion];
    if (firstQuestionData == undefined) {
      console.log("Error: can't find first question, won't show anything.");
      return;
    }
    let now = new Date();
    let elapsedSeconds = (now - firstQuestionData.lastAnswerTime) / 1000;
    console.log("Elapsed: ", elapsedSeconds, "forced: ", forced);
    let frequencySeconds = store.getState().event.data.frequency * 60;
    if (forced || store.getState().questionToShow != firstQuestionData.id && elapsedSeconds > 0.75 * frequencySeconds) {
      store.dispatch(showFirst());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}
