import { NavigationActions, StackActions } from 'react-navigation';

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

  static excuteWithTimeout = (fn,timeSecond = 1)=>{
    return  new Promise(resolve=>{
      setTimeout(()=>resolve(fn),timeSecond*1000);
    });
  }
  
}
