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
  ImageBackground,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import BleManager from 'react-native-ble-manager';
import BaseScreen from '@/screens/BaseScreen';
import images, { icons } from '@/assets';
import _, { debounce } from 'lodash';
import TextStyle from '@/utils/TextStyle';
import { TAG as TAGSIGNIN } from '@/screens/SignIn';
import LocalDatabase from '@/utils/LocalDatabase';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';
import ViewUtil, { delayCallingManyTime } from '@/utils/ViewUtil';
import Util from '@/utils/Util';
import { disconnectBluetooth } from '@/actions/RaceAction';
import { scale, verticalScale } from 'react-native-size-matters';
import styles from './styles';
import { Header } from 'react-native-elements';
import { BUILD_MODE } from '@/utils/Constants';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
export const TAG = 'ReviewSensorScreen';
class ReviewSensorScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.oldPeripheralBluetooth = PeripheralBluetooth.fromJson(
      props.navigation.state.params
    );
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

  set peripherals(newPeripherals: Map) {
    console.log('set peripherals size = ', newPeripherals.size);
    this.setState({
      scanning: false,
      peripherals: newPeripherals
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    this.handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
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

  renderLeftHeader = () => {
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={this.onPressBack}
        >
          <Image
            source={images.ic_backtop}
            style={{ width: 32, height: 32, marginTop: 10 }}
          />
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
                marginHorizontal: 10,
                marginLeft: 20,
                marginTop: 10
              }
            ]}
          >
            Connect to VELO bike
          </Text>
        </TouchableOpacity>
      </View>
    );
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

  handleAppStateChange = nextAppState => {
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
  };

  componentWillUnmount() {
    super.componentWillUnmount();
    console.log(TAG, ' componentWillUnmount ');
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
    // let peripherals = this.state.peripherals;
    // let peripheral = peripherals.get(data.peripheral);
    // if (peripheral) {
    //   peripheral.connected = false;
    //   peripherals.set(peripheral.id, peripheral);
    //   this.setState({ peripherals });
    // }
    // this.isLoading = false;
    console.log('Disconnected from ' + data.peripheral);
  };

  onListenBluetooth = ()=>{
    this.handlerUpdate?.remove();
    this.handlerUpdate = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      this.handleUpdateValueForCharacteristic
    );
  }

  handleUpdateValueForCharacteristic = async data => {
    // value, peripheral, characteristic, service
    try {
      if (this.peripheralBluetooth && !_.isEmpty(data)) {
        alert("connect succesfully");
      }
    } catch (error) {
    } finally {
    }
    console.log(TAG, ' handleUpdateValueForCharacteristic ');
  };

  // handleUpdateValueForCharacteristic = async data => {
  //   // value, peripheral, characteristic, service
  //   try {
  //     if (this.peripheralBluetooth && !_.isEmpty(data)) {
  //       await BleManager.stopNotification(
  //         this.peripheralBluetooth.peripheral,
  //         this.peripheralBluetooth.service,
  //         this.peripheralBluetooth.characteristic
  //       );
  //       await LocalDatabase.saveBluetooth(
  //         JSON.stringify(this.peripheralBluetooth.toJSON())
  //       );
        
  //       alert("connect succesfully");
  //     }
  //   } catch (error) {
  //   } finally {
  //   }
  //   console.log(TAG, ' handleUpdateValueForCharacteristic ');
  // };

  handleStopScan = () => {
    console.log('Scan is stopped size = ', this.peripheralsParams.size);
    this.peripherals = this.peripheralsParams;
  };

  startScan = () => {
    console.log(TAG, ' Begin Scanning...');
    if (!this.state.scanning) {
      this.peripheralsParams.clear();
      this.state.peripherals.clear();
      this.setState({ scanning: true }, () => {
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
        await BleManager.connect(peripheral.id);
        let peripherals = this.state.peripherals;
        item.connected = true;
        peripherals.set(peripheral.id, item);
        // this.setState({ peripherals });
        console.log(TAG, ' connect Connected to ' + peripheral.id);
        const peripheralInfo = await BleManager.retrieveServices(peripheral.id);
        console.log(TAG, ' retrieveServices ', peripheralInfo);
        const id = peripheralInfo.id;
        const services = peripheralInfo.services;
        const characteristics = peripheralInfo.characteristics;
        var serviceUUID = services[2].uuid;
        console.log(TAG, ' connect 01 ');
        var bakeCharacteristic = characteristics[3].characteristic;
        console.log(
          TAG,
          ' retrieveServices serviceUUID = ' +
            serviceUUID +
            ' bakeCharacteristicUUID =' +
            bakeCharacteristic
        );
        // hold previous connection 
        this.oldPeripheralBluetooth = this.peripheralBluetooth;
        this.peripheralBluetooth = null;
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
    const peripheral = item.item;
    // console.log(TAG, ' renderItem = ', peripheral);
    const name =
      peripheral?.name +
      (BUILD_MODE.isStaging ? String(' - ' + peripheral.id) : '');
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: 'transparent', marginTop: 5 }]}
        key={peripheral.id}
        onPress={this.onClickView(async () => {
          this.isLoading = true;

          await Util.excuteWithTimeout(this.excuteDisconnect(), 10);
          Util.excuteWithTimeout(this.connect(item), 10).then(() => {
            this.startScan();
            this.isLoading = false;
          });
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
    if (this.oldPeripheralBluetooth) {
      console.log(TAG, ' disconnectBluetooth begin02 ');
      await this.props.disconnectBluetooth();
      console.log(TAG, ' disconnectBluetooth begin04 ');
    }
  };
  
  render() {
    const { isLoading, scanning } = this.state;
    return (
      <ImageBackground
        style={[styles.container, { paddingBottom: 0, paddingRight: 0 }]}
        source={images.backgroundx}
      >
        <Header
          backgroundColor="transparent"
          outerContainerStyles={{ borderBottomWidth: 0 }}
        >
          {this.renderLeftHeader()}
        </Header>
        <View style={[styles.containerMain]}>
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
                TextStyle.normalText,
                styles.textLabel2,
                { marginLeft: 10, marginTop: 10 }
              ]}
            >
              Please connect the VELO app to bluetooth sensor in VELO bike.
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
              below (pull to refresh if neccessary):
            </Text>

            <FlatList
              onRefresh={this.startScan}
              refreshing={scanning}
              keyExtractor={(item, index) => String(item.id || index)}
              style={styles.scroll}
              data={this.getListAdress()}
              renderItem={this.renderItem}
            />
          </View>
          {this.renderToastMessage()}
        </View>
        {ViewUtil.CustomProgressBar({ visible: isLoading })}
      </ImageBackground>
    );
  }
}

export default connect(
  state => ({}),
  {
    disconnectBluetooth
  }
)(ReviewSensorScreen);
