/* eslint-disable import/no-unresolved */
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
  RefreshControl,
  Image,
  AppState,
  Alert,
  ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import BleManager from 'react-native-ble-manager';
import BaseScreen from '@/screens/BaseScreen';
import images, { icons } from '@/assets';
import _,{debounce} from 'lodash';
import TextStyle from '@/utils/TextStyle';
import { TAG as TAGSIGNIN } from '@/screens/SignIn';
import LocalDatabase from '@/utils/LocalDatabase';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';
import ViewUtil, {  } from '@/utils/ViewUtil';
import Util from '@/utils/Util';
import { disconnectBluetooth,connectAndSaving } from '@/actions/RaceAction';
import { scale, verticalScale } from 'react-native-size-matters';
import styles from './styles';
import { BUILD_MODE } from '@/utils/Constants';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
export const TAG = 'SetupScreen';
class SetupScreen extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      scanning: false,
      isLoading: false,
      peripherals: new Map(),
      refreshing: false,
      appState: ''
    };
    this.peripheralsParams = new Map(); 
    BleManager.start({ showAlert: true, forceLegacy: false });
    this.handlerUpdate = null;
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  set peripherals(newPeripherals:Map){
    // this.state.peripherals.clear();
    console.log('set peripherals size = ',newPeripherals.size);
    this.setState({
      scanning: false,
      peripherals:newPeripherals
    });
  }

  componentDidMount() {
    console.log(TAG,' componentDidMount FLAVOR = ',Util.infoConfig());
    AppState.addEventListener('change', this.handleAppStateChange);

    this.handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral=>{
        if (
          !this.peripheralsParams.has(peripheral.id) &&
          !_.isEmpty(peripheral) &&
          !_.isEmpty(peripheral.name)
        ) {
          this.peripheralsParams?.set(peripheral.id, peripheral);
        }
       
      } 
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
      let result = await PermissionsAndroid.checkPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );

      let result2 = await PermissionsAndroid.checkPermission(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      let result3 = await PermissionsAndroid.checkPermission(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );

      if (result && result2 & result3) {
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

        if (result && result2 & result3) {
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
    if(Platform.OS === 'android'){
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
    }
    return true;
  };

  handleAppStateChange=(nextAppState)=>{
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
        // console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({ appState: nextAppState });
  }

  componentWillUnmount = async ()=> {
    super.componentWillUnmount();
    console.log(TAG, ' componentWillUnmount ');
    this.stopNotifty();
  }

  stopNotifty = async ()=>{
    
    console.log(TAG, ' stopNotifty 01');
    this.handlerDiscover?.remove();
    this.handlerStop?.remove();
    this.handlerDisconnect?.remove();
    this.handlerUpdate?.remove();
    
    if(this.handlerDiscover && this.peripheralBluetooth){
      console.log(TAG, ' stopNotifty 02');
      await BleManager.stopNotification(
        this.peripheralBluetooth.peripheral,
        this.peripheralBluetooth.service,
        this.peripheralBluetooth.characteristic
      );
    }
    BleManager.stopScan();
    this.handlerDiscover = null;
    this.handlerUpdate = null;
    this.handlerDisconnect = null;
    this.handlerStop = null;
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
    this.isLoading = false;
    console.log('Disconnected from ' + data.peripheral);
  };

  handleUpdateValueForCharacteristic = async data => {
    // console.log(' handleUpdateValueForCharacteristic Received  ', data.value);
    // let temp = bytesToString(data.value);
    // let a = temp + '';
    // let b = a.split(',')[1];
    // console.log(TAG, `handleUpdateValueForCharacteristic 01 Recieved ${temp} for characteristic`);
    // value, peripheral, characteristic, service
    try {
      if (this.peripheralBluetooth && !_.isEmpty(data)) {
        
        await LocalDatabase.saveBluetooth(
          JSON.stringify(this.peripheralBluetooth.toJSON())
        );
        await this.stopNotifty();
        // alert("connect succesfully");
      }
    } catch (error) {
    } finally {
      
      this.replaceScreen(this.props.navigation, TAGSIGNIN);
    }
    
    console.log(TAG, ' handleUpdateValueForCharacteristic ');
  };

  handleStopScan =()=> {
    console.log('Scan is stopped size = ',this.peripheralsParams.size);
    this.peripherals = this.peripheralsParams;
    
  }

  startScan = () => {
    console.log(TAG, ' Begin Scanning...');
    if (!this.state.scanning) {
      this.peripheralsParams.clear();
      this.state.peripherals.clear();
      this.setState({ scanning: true}, () => {
        BleManager.scan([], 10, false).then(results => {
          console.log('Scanning...');
        });
      });
    }
  };

  connect = async item => {
    try {
      if (item) {
        let peripheral = item.item;
        console.log(TAG, ' connect  begin', item);
        await BleManager.connect(peripheral.id);
        let peripherals = this.state.peripherals;
        item.connected = true;
        peripherals.set(peripheral.id, item);
        this.setState({ peripherals });
        
        const peripheralInfo = await BleManager.retrieveServices(peripheral.id,Platform.OS==='ios'?peripheral.serviceUUIDs:'');
        console.log(TAG, ' retrieveServices ', peripheralInfo);
        const id = peripheralInfo.id;
        const services = peripheralInfo.services;
        console.log(TAG, ' connect Connected to id = ' + peripheral.id+ '-servives = ',services);
        const characteristics = peripheralInfo.characteristics;
        const serviceUUID = Platform.OS === 'ios'? services[0]: services[2].uuid;
        console.log(TAG, ' connect 01 ');
        const bakeCharacteristic = Platform.OS === 'ios'?characteristics[0].characteristic: characteristics[3].characteristic;
        console.log(
          TAG,
          ' retrieveServices serviceUUID = ' +
            serviceUUID +
            ' bakeCharacteristicUUID =' +
            bakeCharacteristic
        );
        BleManager.startNotification(id, serviceUUID, bakeCharacteristic);
        console.log(TAG, ' connect 03 ');
        this.peripheralBluetooth = new PeripheralBluetooth(
          id,
          serviceUUID,
          bakeCharacteristic
        );
        
        console.log('Started notification on end');
      }
    } catch (error) {
    } finally {
      
    }
  };

  renderItem = item => {
    const color = item.connected ? 'green' : '#fff';
    
    const peripheral = item.item;
    
    const name = peripheral?.name + (BUILD_MODE.isStaging?String(' - ' +peripheral.id):'');
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: 'transparent', marginTop: 5 }]}
        key={peripheral.id}
        onPress={this.onClickView(async () => {
          this.isLoading = true;
          await Util.excuteWithTimeout(this.connect(item), 10);
          if(!this.peripheralBluetooth){
            this.isLoading = false;
            this.startScan();
          }
        })}
      >
        <Image
          source={images.ic_bluetooth}
          style={[
            {
              width: 20,
              height: 27,
              marginTop: 8
            }
          ]}
        />
        <Text
          style={[
            TextStyle.normalText,
            {
              textAlign: 'center',
              color: '#FFFFFF',
              padding: 10,
              marginLeft: 20
            }
          ]}
        >
          {name}
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
          <Text style={{ textAlign: 'center' }}>No peripherals</Text>
        </View>
      )
    );
  };
  excuteDisconnect = async () => {
    console.log(TAG, ' disconnectBluetooth begin ');
    const periBluetooth: PeripheralBluetooth = await LocalDatabase.getBluetooth();

    console.log(TAG, ' disconnectBluetooth get data = ', periBluetooth);
    if (periBluetooth && periBluetooth.peripheral) {
      console.log(TAG, ' disconnectBluetooth begin02 ');
      // await BleManager.start({ showAlert: false });
      // await this.props.disconnectBluetooth();
      await LocalDatabase.logout();
      console.log(TAG, ' disconnectBluetooth begin03 ');
      await BleManager.disconnect(periBluetooth.peripheral);
      console.log(TAG, ' disconnectBluetooth begin04 ');
    }
  };
  disconnect = this.onClickView(async () => {
    try {
      this.isLoading = true;
      await Util.excuteWithTimeout(this.excuteDisconnect(), 10);
    } catch (error) {
      console.log(TAG, ' disconnectBluetooth error ', error);
    } finally {
      this.isLoading = false;
    }
  });

  render() {
    const { isLoading,scanning } = this.state;
    return (
      <ImageBackground
        style={[styles.container, { paddingBottom: 0, paddingRight: 0 }]}
        source={images.backgroundx}
      >
        <View
          style={[
            styles.container,
            { paddingLeft: 40, paddingBottom: 0, paddingRight: 0 }
          ]}
        >
          <TouchableOpacity onPress={__DEV__ ? this.disconnect : undefined}>
            <Image
              source={images.logo}
              style={{ width: 58, height: 58, margin: 10, marginTop: 30 }}
            />
          </TouchableOpacity>
          <View
            style={[styles.containerRight, { marginLeft: 20, marginTop: 10 }]}
          >
            <Image
              source={images.bike}
              style={[
                {
                  width: scale(250),
                  height: scale(162),
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  opacity: 0.8
                }
              ]}
            />
            <Text
              style={[
                TextStyle.extraText,
                styles.textLabel,
                { marginLeft: 10, marginTop: 10 }
              ]}
            >
              Autonomous
            </Text>
            <Text
              style={[
                TextStyle.normalText,
                styles.textLabel2,
                { marginLeft: 10, marginTop: 10 }
              ]}
            >
              Welcome to
              {' '}
              <Text style={{ fontWeight: 'bold' }}>VELO</Text>
.
              Please connect the app to
              <Text style={{ fontWeight: 'bold' }}>
                {' '}
                the Bike via Bluetooth
              </Text>
              .
            </Text>
            <Text
              style={[
                TextStyle.normalText,
                styles.textLabel2,
                { marginLeft: 10, marginTop: verticalScale(30) }
              ]}
            >
              Select 
              {' '}
              <Text style={{ fontWeight: 'bold' }}>Meilan-SPD</Text>
              {' '}
              below (pull to refresh if necessary)
            </Text>
            {isLoading ? (
              ViewUtil.CustomProgressBar({ visible: true })
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl onRefresh={this.startScan}
                  tintColor='white'
                  refreshing={scanning}/>
                }
                keyExtractor={(item, index) => String(item.id || index)}
                style={styles.scroll}
                data={this.getListAdress()}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default connect(
  state => ({}),
  {
    disconnectBluetooth,
    connectAndSaving
  }
)(SetupScreen);
