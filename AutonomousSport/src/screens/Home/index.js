import React from 'react';
import { View, Text } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './styles';
import RoomList from '@/components/RoomList';
import { TAG as TAGCREATE } from '@/screens/Create';
// import ApiService from '@/services/ApiService';
// import LocalDatabase from '@/utils/LocalDatabase';
// import Util from '@/utils/Util';
import { fetchUser } from '@/actions/UserAction';

export const TAG = 'HomeScreen';

class HomeScreen extends BaseScreen {
  static navigationOptions = {
    title: 'Home'
  };
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.props.getUser();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
      console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
      return {
        user: nextProps.user
      };
    }
    return null;
  }

  onPressCreateRoom = () => {
    this.props?.navigation?.navigate(TAGCREATE);
  };
  render() {
    return (
      <View style={styles.container}>
        <RoomList />
        <Button
          title="Create Room"
          buttonStyle={styles.button}
          onPress={this.onPressCreateRoom}
        />
      </View>
    );
  }
}

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  { getUser: fetchUser }
)(HomeScreen);
