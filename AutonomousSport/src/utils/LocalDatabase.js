import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import User from '@/models/User';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';

const TAG = 'LocalDatabase';
const KEY_SAVE = {
  USER: 'USER',
  PRACTICE: 'PRACTICE',
  BLUETOOTH: 'BLUETOOTH'
};
export default class LocalDatabase {
  static async getValue(key: String): String {
    // console.log(TAG, ' getValue begin ', key);
    const s = await AsyncStorage.getItem(key);
    return s;
  }
  static async saveValue(key: String, value: Object): {} {
    // value = value instanceof JSON ? JSON.stringify(value) : value;
    await AsyncStorage.setItem(key, value);
  }
  static async saveUserInfo(jsonUser: String) {
    const oldUser = await this.getValue(KEY_SAVE.USER);
    if (jsonUser !== oldUser) {
      const data = { ...JSON.parse(oldUser), ...JSON.parse(jsonUser) };
      await this.saveValue(KEY_SAVE.USER, JSON.stringify(data));
    }
  }

  static async saveBluetooth(jsonBluetooth: String) {
    const old = await this.getValue(KEY_SAVE.BLUETOOTH);
    console.log(TAG, ' saveBluetooth begin old ', old);
    if (jsonBluetooth !== old) {
      console.log(TAG, ' saveBluetooth begin 01');
      // const data = JSON.parse(jsonBluetooth);
      await this.saveValue(KEY_SAVE.BLUETOOTH, jsonBluetooth);
    }
  }
  static async getBluetooth(): PeripheralBluetooth {
    // console.log(TAG, ' getBluetooth begin ');
    const jsonString = await this.getValue(KEY_SAVE.BLUETOOTH);
    const json = _.isEmpty(jsonString) ? null : JSON.parse(jsonString);
    // console.log(
    //   TAG,
    //   ' getBluetooth begin01 json = ',
    //   json,
    //   ' jsonString = ',
    //   jsonString
    // );
    return _.isEmpty(json)
      ? null
      : new PeripheralBluetooth(
          json.peripheral,
          json.service,
          json.characteristic
        );
  }

  static async logout() {
    return await AsyncStorage.multiRemove([
      KEY_SAVE.USER,
      KEY_SAVE.BLUETOOTH,
      KEY_SAVE.PRACTICE
    ]);
  }
  static async getUserInfo(): User {
    const userJson = (await this.getValue(KEY_SAVE.USER)) || '';
    return _.isEmpty(userJson) ? null : new User(JSON.parse(userJson));
  }

  static async getPractiseInfo(): {} {
    const userJson = (await this.getValue(KEY_SAVE.PRACTICE)) || '';
    return _.isEmpty(userJson) ? {} : JSON.parse(userJson);
  }

  static async savePractiseInfo(jsonUser = { kcal: 0, miles: 0 }): {} {
    const oldUser = await this.getValue(KEY_SAVE.PRACTICE);
    if (jsonUser !== oldUser) {
      const data = { ...JSON.parse(oldUser), ...JSON.parse(jsonUser) };
      await this.saveValue(KEY_SAVE.PRACTICE, JSON.stringify(data));
      return data;
    }
    return {};
  }
  static async getUserAccessToken(): String {
    try {
      const userData: User = await this.getUserInfo();
      return userData?.token || '';
    } catch (error) {
      console.log(error);
    }
    return '';
  }
}
