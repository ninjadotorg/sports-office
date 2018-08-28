import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import User from '@/models/User';

const TAG = 'LocalDatabase';
const KEY_SAVE = {
  USER: 'USER'
};
export default class LocalDatabase {
  static async getValue(key: String): String {
    return await AsyncStorage.getItem(key);
  }
  static async saveValue(key: String, value: Object): {} {
    // value = value instanceof JSON ? JSON.stringify(value) : value;
    return await AsyncStorage.setItem(key, value);
  }
  static async saveUserInfo(jsonUser: String) {
    const oldUser = await this.getValue(KEY_SAVE.USER);
    if (jsonUser !== oldUser) {
      const data = { ...JSON.parse(oldUser), ...JSON.parse(jsonUser) };
      await this.saveValue(KEY_SAVE.USER, JSON.stringify(data));
    }
  }
  static async logout() {
    return AsyncStorage.removeItem(KEY_SAVE.USER);
  }
  static async getUserInfo(): User {
    const userJson = (await this.getValue(KEY_SAVE.USER)) || '';
    return _.isEmpty(userJson) ? null : new User(JSON.parse(userJson));
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
