/**
 * @providesModule Constants
 */
import * as ConfigReact from 'react-native-config';
import { scale } from 'react-native-size-matters';
import Util from '@/utils/Util';
import PubNub from 'pubnub';
// import PubNubReact from 'pubnub-react';

export default class Constants {
  static BACK_KEY = 'BACK';
  static MIN_SIZE_VIDEO = scale(100);
}

export class BUILD_MODE {
  static isModeRecordVideo = false;
  static isStaging = 'staging' === ConfigReact.default.FLAVOR;
  static isDebugBuildType = 'debug' === ConfigReact.default.BUILD_TYPE;
}

export class STATE_BLUETOOTH {
  static UNKNOWN = 'UNKNOWN';
  static IDLE = 'IDLE';
  static SCANNING = 'SCANNING';
  static BLUETOOTH_OFF = 'BLUETOOTH_OFF';
  static CONNECTING = 'CONNECTING';
  static SAVING_CONNECTION = 'SAVING_CONNECTION';
  static CONNECTED = 'CONNECTED';
  static DISCONNECTING = 'DISCONNECTING';
  static DISCONNECTED = 'DISCONNECTED';
}
export const Config = {
  API_URL: (() => {
    // if (!__DEV__) {
    //   return '';
    // } else {
    //   return ConfigReact.default.API_URL;
    // }

    return ConfigReact.default.API_URL;
  })(),
  OPENTOK_API_KEY: ConfigReact.default.OPENTOK_API_KEY || '',
  PUBNUB_API_KEY: {
    // subscribeKey: 'sub-c-f38a1c3c-4085-11e9-bd6d-163ac0efd868',
    // publishKey: 'pub-c-7a7f3406-00e4-4839-a5b9-4a279daa1bc7',
    subscribeKey: 'sub-c-2f622326-602a-11e9-92bf-0e148eae7978',
    publishKey: 'pub-c-597dc147-e4e1-450d-83ca-fd546f351719'
    // ssl: true
  }
};

export const pubnub = new PubNub(Config.PUBNUB_API_KEY);

export const COLOR = {
  TRANSPARENT: 'transparent',
  WHITE: '#ffffff',
  BLACK: '#000000',
  BLACK_0_4: 'rgba(0, 0, 0, 0.4)',
  HEADER: '#f8f8f8',
  STATUS_BAR: '#f2f2f2',
  BORDER: '#bbbbbb',
  BORDER_DETAIL: '#CDCDCD',
  BLUE: '#4a90e2',
  BLUE_BUTTON: '#1E4EFF',
  BLUE_DISABLED: '#DBE3FF',
  BLUE_ACTIVE: '#335EFE',
  RED: '#ff0000',
  TEXT: '#333333',
  GRAY: '#E0E0E0'
};
export const CONSTANT_PRACTISE_MESSAGE = {
  START_RACING: () => {
    const arr = ['start_practice_1', 'start_practice_2', 'start_practice_3'];
    const indexRandom = Util.getRandomInt(1, 3);
    return arr[indexRandom];
  },
  REACH_A_DISTANCE: (mile = 0) => {
    const indexRandom = Util.getRandomInt(1, 3);
    switch (mile) {
      case 1:
      case 2:
      case 3:
      case 5:
      case 10:
      case 20:
      case 40:
        return `reach_${mile}mi_${indexRandom}`;
    }

    return '';
  },
  PASS_A_SPEED: (speed = 0) => {
    const indexRandom = Util.getRandomInt(1, 3);
    switch (speed) {
      case 5:
      case 10:
      case 20:
      case 40:
        return `pass_${speed}_${indexRandom}`;
    }

    return '';
  },
  REACH_A_ENERGY: (kcal = 0) => {
    const indexRandom = Util.getRandomInt(1, 3);
    switch (kcal) {
      case 50:
      case 100:
      case 200:
      case 300:
        return `reach_${kcal}k_${indexRandom}`;
    }

    return '';
  }
};
export const CONSTANT_MESSAGE = {
  START_RACING: [
    'start_1',
    'start_2',
    'start_3',
    'start_4',
    'start_5',
    'start_6',
    'start_7',
    'start_8'
  ],
  REACH_20: (distance = '') => [
    'round_20_1',
    'round_20_2',
    'round_20_3',
    'round_20_4'
  ],
  REACH_50: (distance = '') => [
    'round_50_1',
    'round_50_2',
    'round_50_3',
    'round_50_4',
    'round_50_5',
    'round_50_6',
    'round_50_7',
    'round_50_8',
    'round_50_9',
    'round_50_10'
  ],
  REACH_70: (distance = '') => [
    'round_70_1',
    'round_70_2',
    'round_70_3',
    'round_70_4',
    'round_70_5',
    'round_70_6',
    'round_70_7',
    'round_70_8',
    'round_70_9',
    'round_70_10'
  ],
  REACH_90: (distance = '') => [
    'round_90_1',
    'round_90_2',
    'round_90_3',
    'round_90_4',
    'round_90_5'
  ],
  REACH_99: (distance = '') => [
    'round_99_1',
    'round_99_2',
    'round_99_3',
    'round_99_4',
    'round_99_5'
  ],
  PASS_X: (name = '') => [
    'pass_1',
    'pass_2',
    'pass_3',
    'pass_4',
    'pass_5',
    'pass_6',
    'pass_7',
    'pass_8',
    'pass_9',
    'pass_10',
    'pass_11'
  ],
  X_PASS: (name = '') => [
    'passed_1',
    'passed_2',
    'passed_3',
    'passed_4',
    'passed_5',
    'passed_6',
    'passed_7',
    'passed_8',
    'passed_9',
    'passed_10'
  ],
  FINISH_ANNOUCE_ME: (name = '') => [
    'champion_1',
    'champion_2',
    'champion_3',
    'champion_4',
    'champion_5'
  ],
  FINISH_OTHER: (name = '') => [
    'loser_1',
    'loser_2',
    'loser_3',
    'loser_4',
    'loser_5',
    'loser_6',
    'loser_7',
    'loser_8'
  ]
};
