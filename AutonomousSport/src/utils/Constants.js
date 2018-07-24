/**
 * @providesModule Constants
 */
export default class Constants {
  static BACK_KEY = 'BACK';
}
export const Config = {
  API_URL: (() => {
    if (!__DEV__) {
      return 'http://handshake.autonomous.ai/api-handshake';
    } else {
      return 'http://192.168.0.113:8081';
    }
  })()
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
