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
    'Are you ready? Go!',
    'And... we\'re off!',
    'The race is on! Let\'s go!',
    'You look like a winner. Get this!',
    'Hey speedster. Go get em!'
  ],
  REACH_20: (distance = '') => [
    'You\'re 20% through! Looking good!',
    `Just ${distance} left to go! Keep at it!`,
    `Doing great! ${distance} left to glory!`,
    `Good effort. Let's amp it up for the next leg! ${distance} to go!`,
    'You\'re 20% on the way to victory.'
  ],
  REACH_50: (distance = '') => [
    'Halfway done! Yes!',
    'Already halfway through! Time flies when you\'re going fast.',
    '50% complete. You\'re killing it!',
    'Already 50% champion!',
    'You\'ve passed the halfway mark! No turning back!'
  ],
  REACH_70: (distance = '') => [
    'We\'re in the final third of the race! Push harder!',
    `${distance} left! It's still anyone's race!`,
    `Only ${distance} left! Full speed ahead! `,
    'Already halfway through! Time flies when you\'re going fast.',
    'No time to slack! Only 30% left to go! ',
    'Keep at it, you\'re in the final third!'
  ],
  REACH_90: (distance = '') => [
    'Let\'s up the pace! Only 10% to go ',
    '90% done, you\'re on the home run now!',
    'No time to slack, you\'re nearly there!',
    '10% left to go, let\'s ramp up the pace!',
    'You\'re on the last leg - one last push to the finish line!'
  ],
  REACH_99: (distance = '') => [
    'The finish line is in sight! ',
    'You\'re coming up on the finish line!',
    'So close!',
    'You\'re almost there!',
    'The finish line is right in front of you!'
  ],
  PASS_X: (name = '') => [
    `You’ve just passed ${name}! Keep going!`,
    `You whizzed past ${name}!`,
    `You overtook ${name}! Awesome.`,
    `${name} just bit your dust!`,
    `You left ${name} behind!`
  ],
  X_PASS: (name = '') => [
    `${name} just passed you! Try harder!`,
    `${name} overtook you. Speed up!`,
    `${name} is now in front of you! Catch them!`,
    `You've been overtaken by ${name}. Go faster!`,
    `You're now trailing ${name}! Speed up!`
  ],
  FINISH_ANNOUCE_ME: (name = '') => [
    `Yeah! You win! Congratulations ${name}`,
    'You did it! You\'re number one! ',
    `Well done ${name}! Way to go!`,
    `${name} You\'re the one true champion!`,
    `${name} victory is yours!`
  ],
  FINISH_OTHER: (name = '') => [
    `Times up! ${name} won!`,
    `Better luck next time, ${name} is the winner`,
    `What a race! ${name} takes first place!`,
    `Time\'s up! ${name} takes the crown!`,
    `It\'s all over! ${name} is the victor!`
  ]
};
