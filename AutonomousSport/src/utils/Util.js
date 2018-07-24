const TAG = 'Util';
export default class Util {
  static async getUserInfo() {
    return null;
  }

  static async getUserAccessToken() {
    try {
      const userData = await this.getUserInfo();
      return userData && userData.access_token ? userData.access_token : '';
    } catch (error) {
      console.log(error);
    }
    return '';
  }
}
