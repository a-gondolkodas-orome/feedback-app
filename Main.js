import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';
import Welcome from './Welcome'
import Question from './Question'
// TODO: should be removed.
import { store } from './reducers';

class Main extends React.Component {

    constructor(props) {
      super(props);
    }
  
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
  
  