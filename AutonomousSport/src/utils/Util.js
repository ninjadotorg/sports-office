import { StatusBar } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { screenSize } from '@/utils/TextStyle';
import Constants from '@/utils/Constants';
import * as ConfigReact from 'react-native-config';

const TAG = 'Util';
export default class Util {
  static createDataForSignIn = () => {
    return {
      email: 'binh@test.com',
      password: '123456'
    };
  };
  static infoConfig = () => {
    return `FLAVOR = ${ConfigReact.default.FLAVOR}, BUILD_TYPE = ${
      ConfigReact.default.BUILD_TYPE
    },DEBUG = ${ConfigReact.default.DEBUG}`;
  };

  static isEmailValid(email) {
    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }

  static resetRoute = (navigation, routeName, params = {}) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params })]
    });

    navigation.dispatch(resetAction);
  };

  static timeout = (fn, timeSecond = 1) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(fn), timeSecond * 1000);
    });
  };

  static excuteWithTimeout = (promise: Promise, timeSecond = 1) => {
    return new Promise(function(resolve, reject) {
      const timeout = setTimeout(function() {
        reject(new Error('timeout'));
      }, timeSecond * 1000);
      promise.then(
        success => {
          clearTimeout(timeout);
          resolve(success);
        },
        error => {
          reject(error);
        }
      );
      // promise.then(resolve, reject);
    });
  };

  /**
   * Get a random floating point number between `min` and `max`.
   *
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {number} a random floating point number
   */
  static getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  /**
   * Get a random integer between `min` and `max`.
   *
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {number} a random integer
   */
  static getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  static calculateMapSize = ({ widthReal, heightReal }): {} => {
    const heightMapExpect = screenSize.height;
    let heightMap = heightMapExpect;
    const ratios = widthReal / (heightReal || 1);

    const widthMapExpect = heightMapExpect * ratios;
    let widthMap = heightMap * ratios;

    if (screenSize.width - widthMap < Constants.MIN_SIZE_VIDEO) {
      widthMap = screenSize.width - Constants.MIN_SIZE_VIDEO;
      heightMap = widthMap / ratios;
    }
    let scaleSize = heightMapExpect / heightReal;
    return {
      width: widthMap,
      height: heightMap,
      widthExpect: widthMapExpect,
      heightExpect: heightMapExpect,
      ratios: ratios,
      scaleSize: scaleSize
    };
  };

  static truncate(str, max, sep) {
    if (!str) {
      return '';
    }
    str = str instanceof String ? str : String(str);
    try {
      // Default to 10 characters
      max = max || 10;

      var len = str.length;
      if (len > max) {
        // Default to elipsis
        sep = sep || '...';

        var seplen = sep.length;

        // If seperator is larger than character limit,
        // well then we don't want to just show the seperator,
        // so just show right hand side of the string.
        if (seplen > max) {
          return str.substr(len - max);
        }

        // Half the difference between max and string length.
        // Multiply negative because small minus big.
        // Must account for length of separator too.
        var n = -0.5 * (max - len - seplen);

        // This gives us the centerline.
        var center = len / 2;

        var front = str.substr(0, center - n);
        var back = str.substr(len - center + n); // without second arg, will automatically go to end of line.

        return front + sep + back;
      }

      return str;
    } catch (error) {}
    return str;
  }
}
