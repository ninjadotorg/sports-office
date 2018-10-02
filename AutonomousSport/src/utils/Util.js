import { NavigationActions, StackActions } from 'react-navigation';
import { screenSize } from '@/utils/TextStyle';
import Constants from '@/utils/Constants';

const TAG = 'Util';
export default class Util {
  static createDataForSignIn = () => {
    return {
      email: 'binh@test.com',
      password: '123456'
    };
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

  static excuteWithTimeout = (promise, ms = 1) => {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error('timeout'));
      }, ms * 1000);
      promise.then(resolve, reject);
    });
  };

  static calculateMapSize = ({ widthReal, heightReal }): {} => {
    let heightMap = screenSize.height;
    const ratios = widthReal / (heightReal || 1);

    let widthMap = heightMap * ratios;

    if (screenSize.width - widthMap < Constants.MIN_SIZE_VIDEO) {
      widthMap = screenSize.width - Constants.MIN_SIZE_VIDEO;
      heightMap = widthMap / ratios;
    }
    let scaleSize = heightMap / heightReal;
    return {
      width: widthMap,
      height: heightMap,
      ratios: ratios,
      scaleSize: scaleSize
    };
  };
}
