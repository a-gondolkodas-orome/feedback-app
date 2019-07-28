import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';
import Welcome from './Welcome'
import Question from './Question'
// TODO: should be removed.
import { store } from './reducers';
import { Notifications } from 'expo';
import { registerForPushNotificationsAsync } from './notif';

class Main extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        notification: {},
      }
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
      this.setState({notification: notification});
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
      return (
        <View style={styles.container}>
          <Welcome
            store={store}
          />
          <Text>Origin: {this.state.notification.origin}</Text>
          <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
        </View>
      );
    }
  }
  
  const mapStateToProps = state => ({ 
    event: state.event,
    questionToShow: state.questionToShow
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
  
  