import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import { stringToBytes, bytesToString } from 'convert-string';
import { NativeEventEmitter, NativeModules } from 'react-native';
import LocalDatabase from '@/utils/LocalDatabase';
import { STATE_BLUETOOTH } from '@/utils/Constants';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let receiveDataFromBluetooth = false;
let handlerUpdate = null,
  handlerDisconnect = null;
let timestampPrevious = 0;
let roundPrevious = 0;
const TAG = 'RaceAction';
const cycle = 0.5;
const weight = 70;
export const ACTIONS = {
  CONNECT_BLUETOOTH: 'CONNECT_BLUETOOTH',
  CHECK_SAVING_DEVICE: 'CHECK_SAVING_DEVICE'
};
export const checkSaveDevice = () => async dispatch => {
  const periBluetooth: PeripheralBluetooth = await LocalDatabase.getBluetooth();
  dispatch({
    type: ACTIONS.CHECK_SAVING_DEVICE,
    payload: {
      isSavedDevice: periBluetooth ? true : false
    }
  });
};
/**
 * The RPM to Linear Velocity formular is : 
 v = r × RPM × 0.10472

Where:
 v: Linear velocity, in m/s
 r: Radius, in meter
 RPM: Angular velocity, in RPM (Rounds per Minute)
 */
const timeHour = 1 / 3600;
let speed = 0;
const getMETsHour = speed => {
  if (speed) {
    if (speed < 5.5) {
      return 3.5;
    } else if (speed < 10) {
      return 5.8;
    } else if (speed < 12) {
      return 6.8;
    } else if (speed < 14) {
      return 8;
    } else if (speed < 16) {
      return 10;
    } else if (speed < 20) {
      return 12;
    } else {
      return 15.8;
    }
  }
  return 0;
};
export const connectionBluetoothChange = dispatch => {
  return ({ value, peripheral, characteristic, service }) => {
    if (value && value.length > 4) {
      // const timestamp = Math.floor(Date.now());

      const round = value[2] * 255 + value[1];
      if (round !== roundPrevious) {
        // const timeHour = (timestamp - timestampPrevious) / (1000 * 3600);
        console.log(TAG, ` connectionBluetoothChange data =  ${value}`);
        const rps = round - (roundPrevious <= 0 ? round : roundPrevious);
        // const rph = rps * timeHour;
        // let speed = rph * 0.68 * cycle;
        // let speed = rph * 0.10472 * cycle;
        // todo HienTon : add 100 to test
        // speed = cycle * 6.28 * 2.2369356 * (rps + 200);
        // speed = cycle * 6.28 * 2.2369356 * rps;
        // speed = 0.0009171425863 * rps;
        speed = 3.301713108 * rps * (__DEV__ ? 1 : 1); // mi/hour
        speed = speed < 0 ? 0 : speed;

        const distanceRun = speed * timeHour;
        // const kcaloriesBurned =
        //   (distanceRun * 1.609344 * weight * 1.036) / 1000;
        const kcaloriesBurned = 0.01935 * getMETsHour(speed);
        // console.log(
        //   TAG,
        //   ` connectionBluetoothChange round = ${round} for distanceRun = ${distanceRun}`
        // );
        // calories burned = distance run (kilometres) x weight of runner (kilograms) x 1.036
        const data = {
          speed: speed,
          distanceStreet: distanceRun,
          kcal: kcaloriesBurned
        };
        roundPrevious = round;
        // timestampPrevious = timestamp;

        dispatch({
          type: ACTIONS.CONNECT_BLUETOOTH,
          payload: {
            state: STATE_BLUETOOTH.CONNECTED,
            data: data
          }
        });
      } else if (speed != 0) {
        speed = 0;
        dispatch({
          type: ACTIONS.CONNECT_BLUETOOTH,
          payload: {
            state: STATE_BLUETOOTH.CONNECTED,
            data: {
              speed: 0,
              distanceStreet: 0,
              kcal: 0
            }
          }
        });
      }
    }
  };
};

export const disconnectBluetoothChange = dispatch => {
  return data => {
    receiveDataFromBluetooth = false;
    dispatch({
      type: ACTIONS.CONNECT_BLUETOOTH,
      payload: {
        state: STATE_BLUETOOTH.DISCONNECTED
      }
    });
    console.log(TAG, ' disconnectBluetoothChange data = ', data);
    connectAndPrepare()(dispatch);
  };
};

export const connectAndPrepare = () => async dispatch => {
  // get data from local
  dispatch({
    type: ACTIONS.CONNECT_BLUETOOTH,
    payload: {
      state: STATE_BLUETOOTH.IDLE,
      data: {}
    }
  });
  const periBluetooth: PeripheralBluetooth = await LocalDatabase.getBluetooth();
  // console.log(TAG, ' connectAndPrepare get data = ', periBluetooth);
  if (!periBluetooth) {
    dispatch({
      type: ACTIONS.CONNECT_BLUETOOTH,
      payload: {
        isSavedDevice: false,
        state: STATE_BLUETOOTH.UNKNOWN,
        data: {}
      }
    });
    return;
  }
  // Connect to device
  console.log(TAG, ' connectAndPrepare begin 01 ');
  dispatch({
    type: ACTIONS.CONNECT_BLUETOOTH,
    payload: {
      isSavedDevice: true,
      state: STATE_BLUETOOTH.CONNECTING,
      data: {}
    }
  });

  await BleManager.start({ showAlert: false });
  // const isConnected = await BleManager.isPeripheralConnected(
  // periBluetooth.peripheral,
  // [periBluetooth.service]
  // );
  console.log(TAG, ' connectAndPrepare 01 state-----');
  if (!receiveDataFromBluetooth) {
    try {
      await BleManager.connect(periBluetooth.peripheral);
      console.log(TAG, ' connectAndPrepare 02 ');
      dispatch({
        type: ACTIONS.CONNECT_BLUETOOTH,
        payload: {
          state: STATE_BLUETOOTH.CONNECTING,
          data: {}
        }
      });

      console.log(TAG, ' connectAndPrepare 03 ');
      await BleManager.retrieveServices(periBluetooth.peripheral);
      console.log(TAG, ' connectAndPrepare 04 ');
      await BleManager.startNotification(
        periBluetooth.peripheral,
        periBluetooth.service,
        periBluetooth.characteristic
      );
      receiveDataFromBluetooth = true;
    } catch (error) {
      dispatch({
        type: ACTIONS.CONNECT_BLUETOOTH,
        payload: {
          state: STATE_BLUETOOTH.UNKNOWN,
          data: {}
        }
      });
    }

    console.log(TAG, ' connectAndPrepare 05 ');
    if (handlerUpdate) {
      handlerUpdate.remove();
      handlerUpdate = null;

      bleManagerEmitter.removeSubscription(handlerDisconnect);
      handlerDisconnect = null;
    }

    handlerUpdate = bleManagerEmitter?.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      connectionBluetoothChange(dispatch)
    );

    handlerDisconnect = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      disconnectBluetoothChange(dispatch)
    );
  } else {
    dispatch({
      type: ACTIONS.CONNECT_BLUETOOTH,
      payload: {
        state: STATE_BLUETOOTH.CONNECTED,
        data: {}
      }
    });
  }
};

export const disconnectBluetooth = () => async dispatch => {
  dispatch({
    type: ACTIONS.CONNECT_BLUETOOTH,
    payload: {
      state: STATE_BLUETOOTH.DISCONNECTING,
      data: {}
    }
  });
  timestampPrevious = 0;
  roundPrevious = 0;
  try {
    const periBluetooth: PeripheralBluetooth = await LocalDatabase.getBluetooth();
    console.log(TAG, ' disconnectBluetooth get data = ', periBluetooth);
    if (handlerUpdate) {
      handlerUpdate?.remove();
      handlerUpdate = null;
      bleManagerEmitter.removeSubscription(handlerDisconnect);
      handlerDisconnect = null;
    }
    if (periBluetooth && periBluetooth.peripheral) {
      console.log(TAG, ' disconnectBluetooth stop-----');
      await BleManager.start({ showAlert: false });
      console.log(TAG, ' disconnectBluetooth stop11-----');
      receiveDataFromBluetooth = false;
      console.log(TAG, ' disconnectBluetooth stop12-----');
      await BleManager.stopNotification(
        periBluetooth.peripheral,
        periBluetooth.service,
        periBluetooth.characteristic
      );
      console.log(TAG, ' disconnectBluetooth stop13-----');
      await BleManager.disconnect(periBluetooth.peripheral);
    }
  } catch (error) {
    console.log(TAG, ' disconnectBluetooth error');
  }

  console.log(TAG, ' disconnectBluetooth end ');
  dispatch({
    type: ACTIONS.CONNECT_BLUETOOTH,
    payload: {
      state: STATE_BLUETOOTH.DISCONNECTED,
      data: {}
    }
  });
};
