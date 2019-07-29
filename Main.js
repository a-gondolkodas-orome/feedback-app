import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';
import Welcome from './Welcome'
import Question from './Question'
// TODO: should be removed.
import { chooseQuestion } from './logic';
import { store } from './reducers';
import { Notifications } from 'expo';
import { registerForPushNotificationsAsync } from './notif';

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
//      this.setState({notification: notification});
//      alert('Notification received:' + notification.origin + ', ' + notification.data);
      console.log(notification);
      chooseQuestion();
  };

  render() {
    if (this.props.questionToShow != "") {
      return (
        <View style={styles.container}>
          <Text style={{marginTop: 40, fontSize: 24, color: "grey"}}>{this.props.event.data.name}</Text>
          <Question
            store={store}
          />
        </View>
      );
    }
    else if (this.props.eventId != "") {
      return (
        <View style={styles.container}>
          <Text style={{marginTop: 40, fontSize: 24, color: "grey"}}>{this.props.event.data.name}</Text>
          <Text>Majd küldünk értesítést, ha kapsz kitöltendő kérdést.</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Welcome
          store={store}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({ 
  event: state.event,
  eventId: state.eventId,
  questionToShow: state.questionToShow,
});

export default connect(mapStateToProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

