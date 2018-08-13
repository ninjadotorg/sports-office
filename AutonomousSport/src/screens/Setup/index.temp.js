import React from 'react';
import { StyleSheet,
  View,
  Image,
  Dimensions,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  NativeEventEmitter,
  NativeModules, 
  Platform,
  FlatList,
  PermissionsAndroid,
  Alert } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './styles';
import RoomList from '@/components/RoomList';
import { TAG as TAGCREATE } from '@/screens/Create';
import { fetchUser } from '@/actions/UserAction';
import BleManager from 'react-native-ble-manager';
import {stringToBytes, bytesToString} from 'convert-string';
import { Promise } from 'core-js';
import { resolve } from 'rsvp';
var Buffer = require('buffer/').Buffer;
export const TAG = 'SetupScreen';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const sendCommand = (id, command) => {

  BleManager
    .retrieveServices(id)
    .then((peripheralInfo) => {
      // Success code
      console.log(peripheralInfo);
      const id = peripheralInfo.id;
      const services = peripheralInfo.services;
      const characteristics = peripheralInfo.characteristics;
      let tmp = JSON.stringify(command);
      const data = stringToBytes(tmp);
      BleManager
        .write(id, services[2].uuid, characteristics[6].characteristic, data)
        .then(() => {
          console.log("data");
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });
    })
    .catch((error) => {
      // Failure code
      console.log(error);
    });

};
class SetupScreen extends BaseScreen {
  static navigationOptions = {
    title: 'Setup'
  };
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      scanning:false,
      peripherals: new Map()
    };
  }

  connect = async (id) => {
    console.log(" connecting to this device " + id);
    let promise = new Promise((resolve,reject)=>{
      BleManager.connect(id).then(resolve(1))
      .catch((error) => {
        Alert.alert("Error", 'Something went wrong while trying to connect.');
        resolve(0);
      });
      setTimeout(resolve(0,10000));
    });
    return promise;
  }

  startScan = async ()=> {
    if (!this.state.scanning) {
      this.setState({peripherals: new Map()});

      const result = await BleManager.scan([], 3, true);
      if(result){
        this.setState({scanning:true});
      }
    }
  }

  componentDidMount() {
    BleManager.start({showAlert: false});
    this.checkPermission().then(result=>{
      if(result){

      }
    });
  }

  checkPermission = async ()=>{
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      let result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      if (result) {
        console.log("Permission is OK");
        return Promise.resolve(1);
      } else {
        result = await PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
          if (result) {
            console.log("User accept");
            return Promise.resolve(1);
          } else {
            console.log("User refuse");
            return Promise.resolve(0);
          }
      }
    }
    return Promise.resolve(1);
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  componentWillUnmount() {
    this.handlerDiscover?.remove();
    this.handlerStop?.remove();
    this.handlerDisconnect?.remove();
    this.handlerUpdate?.remove();
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

SetupScreen.propTypes = {};

SetupScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  { getUser: fetchUser }
)(SetupScreen);
