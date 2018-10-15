import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  FlatList,
  ScrollView,
  Image,
  AppState,
  Alert,
  Dimensions
} from 'react-native';

import { stringToBytes, bytesToString } from 'convert-string';
import BleManager from 'react-native-ble-manager';
import BaseScreen from '@/screens/BaseScreen';
import styles from './styles';
import images, { icons } from '@/assets';
import _ from 'lodash';
import TextStyle from '@/utils/TextStyle';
import { TAG as TAGSIGNIN } from '@/screens/SignIn';
import LocalDatabase from '@/utils/LocalDatabase';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';
import ViewUtil from '@/utils/ViewUtil';
import Util from '@/utils/Util';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
export const TAG = 'SetupScreen';
export default class SetupScreen extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      scanning: false,
      isLoading: false,
      peripherals: new Map(),
      refreshing: false,
      appState: ''
    };
    BleManager.start({ showAlert: true });
    this.handlerUpdate = null;
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(
      this
    );
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    this.handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      this.handleDiscoverPeripheral
    );
    this.handlerStop = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      this.handleStopScan
    );
    this.handlerDisconnect = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      this.handleDisconnectedPeripheral
    );
    this.handlerUpdate = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      this.handleUpdateValueForCharacteristic
    );

    this.checkConditionForScan().then(result => {
      if (result) {
        this.startScan();
      }
    });
  }

  checkPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      let result = await PermissionsAndroid.check(
         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );
  
      let result2 = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      let result3 = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
 
      
       

      if (result && result2 & result3 ) {
        console.log('Permission is OK');
        return Promise.resolve(1);
      } else {

        result = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );  
        result2 = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );   

        result3 = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );  

        if (result && result2 & result3 ) {
          console.log('Permission User accept');
          return Promise.resolve(1);
        } else {
          console.log('Permission User refuse');
          return Promise.resolve(0);
        }
      }
    }
    return Promise.resolve(1);
  };

  checkConditionForScan = async () => {
    let result = await this.checkPermission();
    if (result && result > 0) {
      result = await BleManager.enableBluetooth();
      if (!result) {
        return true;
      } else {
        Alert.alert('You need to enable bluetooth to use this app.');
        return false;
      }
    } else {
      Alert.alert('You need to permission to use this app.');
      return false;
    }
  };

  handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({ appState: nextAppState });
  }

  componentWillUnmount() {
    console.log(TAG, ' componentWillUnmount ');
    clearTimeout(this.timeout);
    if (this.peripheralBluetooth) {
      BleManager.stopNotification(
        this.peripheralBluetooth.peripheral,
        this.peripheralBluetooth.service,
        this.peripheralBluetooth.characteristic
      );
    }
    console.log(TAG, ' componentWillUnmount01 ');
    this.handlerDiscover?.remove();
    console.log(TAG, ' componentWillUnmount02 ');
    this.handlerStop?.remove();
    console.log(TAG, ' componentWillUnmount03 ');
    this.handlerDisconnect?.remove();
    console.log(TAG, ' componentWillUnmount04 ');
    this.handlerUpdate?.remove();
    console.log(TAG, ' componentWillUnmountend ');
  }

  set isLoading(isLoading) {
    this.setState({
      isLoading: isLoading
    });
  }

  handleDisconnectedPeripheral = data => {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  handleUpdateValueForCharacteristic = async data => {
    // console.log(' handleUpdateValueForCharacteristic Received  ', data.value);
    // let temp = bytesToString(data.value);
    // let a = temp + '';
    // let b = a.split(',')[1];
    // console.log(TAG, `handleUpdateValueForCharacteristic 01 Recieved ${temp} for characteristic`);
    // value, peripheral, characteristic, service

    if (!_.isEmpty(data)) {
      this.replaceScreen(this.props.navigation, TAGSIGNIN);
    }
  };

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  startScan = () => {
    if (!this.state.scanning) {
      BleManager.scan([], 10, false).then(results => {
        console.log('Scanning...');
        this.setState({ scanning: true, peripherals: new Map() });
      });
    }
  };
  handleDiscoverPeripheral = peripheral => {
    console.log(TAG, ' handleDiscoverPeripheral begin');
    let peripherals = this.state.peripherals;
    if (
      !peripherals.has(peripheral.id) &&
      !_.isEmpty(peripheral) &&
      peripheral.name
    ) {
      peripherals?.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
  };

  connect = item => {
    if (item) {
      let peripheral = item.item;
      if (item.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let peripherals = this.state.peripherals;
            // let p = peripherals.get(peripheral.id);
            // if (p) {
            //   p.connected = true;
            //   peripherals.set(peripheral.id, p);
            //   this.setState({ peripherals });
            // }
            item.connected = true;
            peripherals.set(peripheral.id, item);
            this.setState({ peripherals });
            console.log('Connected to ' + peripheral.id);

            // setTimeout(() => {
            // Test using bleno's pizza example
            // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
            BleManager.retrieveServices(peripheral.id).then(peripheralInfo => {
              console.log(TAG, ' retrieveServices ', peripheralInfo);
              const id = peripheralInfo.id;
              const services = peripheralInfo.services;
              const characteristics = peripheralInfo.characteristics;
              var serviceUUID = services[2].uuid;

              var bakeCharacteristic = characteristics[3].characteristic;
              console.log(
                TAG,
                ' retrieveServices serviceUUID = ' +
                  serviceUUID +
                  ' bakeCharacteristicUUID =' +
                  bakeCharacteristic
              );
              clearTimeout(this.timeout || 0);
              this.timeout = setTimeout(() => {
                BleManager.startNotification(
                  id,
                  serviceUUID,
                  bakeCharacteristic
                )
                  .then(async () => {
                    // save local database :serviceUUID,bakeCharacteristic,peripherals
                    this.peripheralBluetooth = new PeripheralBluetooth(
                      id,
                      serviceUUID,
                      bakeCharacteristic
                    );
                    await LocalDatabase.saveBluetooth(
                      JSON.stringify(this.peripheralBluetooth.toJSON())
                    );
                    this.isLoading = false;
                    console.log('Started notification on end');
                  })
                  .catch(error => {
                    this.isLoading = false;
                    console.log('Notification error', error);
                  });
              });
            }, 1000);
          })
          .catch(error => {
            this.isLoading = false;
            console.log('Connection error', error);
          });
      }
    }
  };

  renderItem = item => {
    const color = item.connected ? 'green' : '#fff';
    console.log(TAG, ' renderItem = ', item);
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: 'transparent' }]}
        key={item.id}
        onPress={this.onClickView(async () => {
          console.log(TAG, ' onPressItemConnect = begin ');
          this.isLoading = true;
          await Util.excuteWithTimeout(this.connect(item), 7);
          this.isLoading = false;
          this.startScan();
        })}
      >
        <Text
          style={[
            TextStyle.mediumText,
            {
              textAlign: 'center',
              color: '#FFFFFF',
              padding: 10
            }
          ]}
        >
          {item?.item?.name || ''}
        </Text>
      </TouchableOpacity>
    );
  };
  getListAdress = () => {
    console.log(TAG, ' getListAdress = ', this.state.peripherals.values());
    return Array.from(this.state.peripherals.values());
  };
  renderEmpty = () => {
    return (
      this.getListAdress().length === 0 && (
        <View style={{ flex: 1, margin: 20 }}>
          <Text style={{ textAlign: 'center' }}>No peripherals</Text>
        </View>
      )
    );
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <Image
          source={images.logo}
          style={{ width: 40, height: 40, margin: 10 }}
        />
        <View style={styles.containerRight}>
          <Text style={[TextStyle.mediumText, styles.textLabel]}>
            Autonomous
          </Text>
          <Text style={[TextStyle.normalText, styles.textLabel2]}>
            Welcome to Autonomous Bike. Please connect the app to the Bike via
            Bluetooth.
          </Text>
          <Text style={[TextStyle.normalText, styles.textLabel2]}>
            Select Autonomous Bike below:
          </Text>
          {isLoading ? (
            ViewUtil.CustomProgressBar({ visible: true })
          ) : (
            <FlatList
              onRefresh={this.startScan}
              refreshing={this.state.scanning}
              keyExtractor={(item, index) => item.id}
              style={styles.scroll}
              data={this.getListAdress()}
              renderItem={this.renderItem}
            />
          )}
          <Image
            source={images.bike}
            style={{
              width: 120,
              height: 120,
              bottom: 0,
              right: 0,
              position: 'absolute'
            }}
          />
        </View>
      </View>
    );
  }
}
