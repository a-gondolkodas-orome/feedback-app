import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Welcome from './Welcome';
import Question from './Question';
import Joke from './Joke';
import { store } from './reducers';
import Menu, { MenuItem } from 'react-native-material-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import { leaveEvent } from './actions';
import * as strings from './strings';

class Main extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

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
    let innerComponent = (
        <View>
          <Text style={styles.textStyle}>
            {this.props.noQuestionText}
          </Text>
          <Joke />
        </View>
      );
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
              style={{ marginTop: 40 }}
            >
              <MenuItem onPress={() => store.dispatch(leaveEvent())}>
                {strings.EXIT_TEXT}
              </MenuItem>
            </Menu>
          </View>
        </View>
        <Spinner
          visible={this.props.spinner}
          cancelable={true}
        />
        <ScrollView style={{alignSelf: 'stretch'}}>
          {innerComponent}
        </ScrollView>
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

