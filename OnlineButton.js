import React from "react";
import { Alert, NetInfo, Platform, TouchableOpacity } from "react-native";
import * as strings from './strings';

export default class OnlineButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkConnectivity = () => {
    // For Android devices
    if (Platform.OS === "android") {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.props.onPress();
        } else {
          Alert.alert(strings.OFFLINE_TEXT);
        }
      });
    } else {
      // For iOS devices
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
      );
    }
  };

  handleFirstConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
      Alert.alert(strings.OFFLINE_TEXT);
    } else {
      this.props.onPress();
    }
  };

  render() {
    return (
      <TouchableOpacity style={this.props.style} onPress={this.checkConnectivity}>
         {this.props.children}
      </TouchableOpacity>
    );
  }
}