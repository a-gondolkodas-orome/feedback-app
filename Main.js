import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Welcome from './Welcome'
import Question from './Question'
import { store } from './reducers';
import { Notifications } from 'expo';
import { registerForPushNotificationsAsync } from './notif';
import Menu, { MenuItem } from 'react-native-material-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import { showNextDueQuestion, makeQuestionDue, leaveEvent } from './actions';

class Main extends React.Component {

  constructor(props) {
    super(props);
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
        store.dispatch(makeQuestionDue(id));
      }
      else if (question.scheduledFor !== null) {
        // debugging
      }
    }

    if (store.getState().questionToShow === "")
      store.dispatch(showNextDueQuestion());
  };

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  render() {
    // TODO: use navigation instead of this if.
    if (this.props.event == null) {
      return (
        <View style={styles.container}>
        <Spinner
          visible={this.props.spinner}
          cancelable={true}
        />
          <Welcome
            store={store}
          />
        </View>
      );
    }
    let innerComponent = (<Text style={styles.textStyle}>{this.props.noQuestionText}</Text>);
    if (this.props.questionToShow != "") {
      innerComponent = (<Question store={store}/>);
    }
    return (
      <View style={styles.container}>
        <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10, marginTop: 40 }}>
          <Text style={styles.eventTextStyle}>{this.props.event.data.name}</Text>
          <View style={{position: 'absolute', right: 5 }}>
            <Menu
              ref={this.setMenuRef}
              button={<Text onPress={this.showMenu} style={styles.menuDotsStyle}>&#x2807;</Text>}
            >
              <MenuItem onPress={() => store.dispatch(leaveEvent())}>
                Kilépés a kísérletből
              </MenuItem>
            </Menu>
          </View>
        </View>
        <Spinner
          visible={this.props.spinner}
          cancelable={true}
        />

        {innerComponent}
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
    justifyContent: 'flex-start',
  },
  textStyle: {
    marginTop: 30,
    fontSize: 24,
    color: '#fff',
    textAlign: "center",
    margin: 20,
  },
  eventTextStyle: {
    margin: 10,
    fontSize: 30,
    color: '#d3d3d3',
    textAlign: "center"
  },
  menuDotsStyle: {
    color:'#fff',
    fontSize: 30
  },
});

