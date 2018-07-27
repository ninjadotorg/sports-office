import LocalDatabase from './LocalDatabase';

const TAG = 'Util';
export default class Util {
  static createDataForSignIn = () => {
    return {
      email: 'binh@test.com',
      password: '123456'
    };
  };
}
