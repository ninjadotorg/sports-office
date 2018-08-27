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
    return await AsyncStorage.setItem(key, value);
  }
  static async saveUserInfo(jsonUser: String) {
    const oldUser = await this.getValue(KEY_SAVE.USER);
    if (jsonUser !== oldUser) await this.saveValue(KEY_SAVE.USER, jsonUser);
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
