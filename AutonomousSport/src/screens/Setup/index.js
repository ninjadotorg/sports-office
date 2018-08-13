import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  FlatList,
  ScrollView,
  AppState,
  Alert,
  Dimensions
} from 'react-native';
import { stringToBytes, bytesToString } from 'convert-string';
import BleManager from 'react-native-ble-manager';
import BaseScreen from '@/screens/BaseScreen';
import styles from './styles';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const TAG = 'SetupScreen';
export default class SetupScreen extends BaseScreen {
  constructor() {
    super();

    this.state = {
      scanning: false,
      peripherals: new Map(),
      refreshing: false,
      appState: ''
    };
    this.handlerUpdate = null;
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(
      this
    );
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({ showAlert: false });

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
    // this.handlerUpdate = bleManagerEmitter.addListener(
    //   'BleManagerDidUpdateValueForCharacteristic',
    //   this.handleUpdateValueForCharacteristic
    // );

    this.checkPermission().then(result => {
      console.log(TAG, ' componentDidMount permission = ', result);
    });

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
      if (result) {
        console.log('Permission is OK');
        return Promise.resolve(1);
      } else {
        result = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        if (result) {
          console.log('User accept');
          return Promise.resolve(1);
        } else {
          console.log('User refuse');
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
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate?.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic = data => {
    console.log('Received data from characteristic ', data);
    // let temp = bytesToString(data.value);
    // let a = temp + '';
    // let b = a.split(',')[1];
    // console.log('Received data from characteristic ' + temp);
  };

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  startScan = () => {
    if (!this.state.scanning) {
      BleManager.scan([], 3, true).then(results => {
        console.log('Scanning...');
        this.setState({ scanning: true, peripherals: new Map() });
      });
    }
  };

  //   retrieveConnected() {
  //     BleManager.getConnectedPeripherals([]).then(results => {
  //       if (results.length == 0) {
  //         console.log('retrieveConnected No connected peripherals');
  //       }
  //       console.log(TAG, 'retrieveConnected ', results);
  //       var peripherals = this.state.peripherals;
  //       for (var i = 0; i < results.length; i++) {
  //         var peripheral = results[i];
  //         peripheral.connected = true;
  //         peripherals.set(peripheral.id, peripheral);
  //         this.setState({ peripherals });
  //       }
  //     });
  //   }

  handleDiscoverPeripheral = peripheral => {
    var peripherals = this.state.peripherals;
    if (!peripherals.has(peripheral.id) && peripheral.name) {
      //   console.log(TAG, ' handleDiscoverPeripheral ', peripheral);
      peripherals.set(peripheral.id, peripheral);
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
                  bakeCharacteristic?.uuid
              );
              //   var crustCharacteristic = '13333333-3333-3333-3333-333333330001';

              setTimeout(() => {
                BleManager.startNotification(
                  id,
                  serviceUUID,
                  bakeCharacteristic
                )
                  .then(() => {
                    console.log('Started notification on ' + id);
                    this.handlerUpdate = bleManagerEmitter.addListener(
                      'BleManagerDidUpdateValueForCharacteristic',
                      this.handleUpdateValueForCharacteristic
                    );
                  })
                  .catch(error => {
                    console.log('Notification error', error);
                  });
              });
            }, 1000);
          })
          .catch(error => {
            console.log('Connection error', error);
          });
      }
    }
  };
  renderItem = item => {
    const color = item.connected ? 'green' : '#fff';
    // console.log(TAG, ' renderItem = ', item);
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: color }]}
        key={item.id}
        onPress={() => this.connect(item)}
      >
        <Text
          style={{
            fontSize: 12,
            textAlign: 'center',
            color: '#333333',
            padding: 10
          }}
        >
          {item?.item?.name || ''}
        </Text>
      </TouchableOpacity>
    );
  };
  getListAdress = () => {
    // console.log(TAG, ' getListAdress = ', this.state.peripherals.values());
    return Array.from(this.state.peripherals.values());
  };
  renderEmpty = () => {
    return (
      this.getListAdress().length === 0 && (
        <View style={{ flex: 1, margin: 20 }}>
          <Text style={{ textAlign: 'center' }}>
No peripherals
          </Text>
        </View>
      )
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          onRefresh={this.startScan}
          refreshing={this.state.scanning}
          keyExtractor={(item, index) => item.id}
          style={styles.scroll}
          data={this.getListAdress()}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
