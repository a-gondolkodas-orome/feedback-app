
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
import { showFirst } from './actions';

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
  apiKey: "AIzaSyDmshJPEN5RyoQB5HI9f6vf4Ys7dn8Gkkw",
  projectId: "feedback-app-ago",
  authDomain: "feedback-app-ago.firebaseapp.com",
  databaseURL: "https://feedback-app-ago.firebaseio.com",
  storageBucket: "feedback-app-ago.appspot.com"
};

firebase.initializeApp(firebaseConfig);

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
    let frequencySeconds = firstQuestionData.data.frequency * 60;
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
