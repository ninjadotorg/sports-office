/**
 * @providesModule Constants
 */
import * as ConfigReact from 'react-native-config';
import { scale } from 'react-native-size-matters';

export default class Constants {
  static BACK_KEY = 'BACK';
  static MIN_SIZE_VIDEO = scale(100);
}

export class STATE_BLUETOOTH {
  static UNKNOWN = 'UNKNOWN';
  static IDLE = 'IDLE';
  static SCANNING = 'SCANNING';
  static BLUETOOTH_OFF = 'BLUETOOTH_OFF';
  static CONNECTING = 'CONNECTING';
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
  OPENTOK_API_KEY: ConfigReact.default.OPENTOK_API_KEY || ''
};
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
