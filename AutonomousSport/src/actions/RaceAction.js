import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import { stringToBytes, bytesToString } from 'convert-string';
import { NativeEventEmitter, NativeModules } from 'react-native';
import LocalDatabase from '@/utils/LocalDatabase';
import { STATE_BLUETOOTH } from '@/utils/Constants';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
let handlerUpdate = null;
let timestampPrevious = 0;
let roundPrevious = 0;
const TAG = 'RaceAction';
const cycle = 1.0;
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
export const connectionBluetoothChange = dispatch => {
  return ({ value, peripheral, characteristic, service }) => {
    if (value && value.length > 4) {
      const timestamp = Math.floor(Date.now());

      const round = value[2] * 255 + value[1];
      const timeHour = (timestamp - timestampPrevious) / (1000 * 3600);
      const rps = (round - roundPrevious) / timeHour;
      const speed = rps * 0.68 * cycle;
      const distanceRun = speed * timeHour;
      const kcaloriesBurned = (distanceRun * 1.609344 * weight * 1.036) / 1000;
      // calories burned = distance run (kilometres) x weight of runner (kilograms) x 1.036
      const data = {
        speed: speed,
        distanceStreet: distanceRun,
        kcal: kcaloriesBurned
      };
      roundPrevious = round;
      timestampPrevious = timestamp;
      dispatch({
        type: ACTIONS.CONNECT_BLUETOOTH,
        payload: {
          state: STATE_BLUETOOTH.CONNECTED,
          data: data
        }
      });
    }

    console.log(TAG, ` Recieved ${value} for characteristic ${characteristic}`);
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
  console.log(TAG, ' connectAndPrepare get data = ', periBluetooth);
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

  dispatch({
    type: ACTIONS.CONNECT_BLUETOOTH,
    payload: {
      isSavedDevice: true,
      state: STATE_BLUETOOTH.CONNECTING,
      data: {}
    }
  });
  console.log(TAG, ' connectAndPrepare 01 ');
  await BleManager.start({ showAlert: false });
  await BleManager.connect(periBluetooth.peripheral);
  console.log(TAG, ' connectAndPrepare 02 ');
  dispatch({
    type: ACTIONS.CONNECT_BLUETOOTH,
    payload: {
      state: STATE_BLUETOOTH.CONNECTED,
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

  console.log(TAG, ' connectAndPrepare 05 ');
  if (handlerUpdate) {
    bleManagerEmitter.removeSubscription(handlerUpdate);
    handlerUpdate.remove();
  }
  handlerUpdate = bleManagerEmitter?.addListener(
    'BleManagerDidUpdateValueForCharacteristic',
    connectionBluetoothChange(dispatch)
  );
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
  const periBluetooth: PeripheralBluetooth = await LocalDatabase.getBluetooth();
  console.log(TAG, ' disconnectBluetooth get data = ', periBluetooth);
  if (handlerUpdate) {
    bleManagerEmitter.removeSubscription(handlerUpdate);
    handlerUpdate?.remove();
  }
  if (periBluetooth && periBluetooth.peripheral) {
    BleManager.stopNotification(
      periBluetooth.peripheral,
      periBluetooth.service,
      periBluetooth.characteristic
    );
  }
  dispatch({
    type: ACTIONS.CONNECT_BLUETOOTH,
    payload: {
      state: STATE_BLUETOOTH.DISCONNECTED,
      data: {}
    }
  });
};
