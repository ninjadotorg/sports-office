import LocalDatabase from './LocalDatabase';

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
}
