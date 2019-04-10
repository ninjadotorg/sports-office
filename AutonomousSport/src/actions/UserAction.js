import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import User from '@/models/User';
import Util from '@/utils/Util';
import _ from 'lodash';
// import firebase from 'react-native-firebase';

const TAG = 'UserAction';
export const ACTIONS = {
  AUTH_FORGOT: 'AUTH_FORGOT',
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_UPDATE: 'AUTH_UPDATE',
  GET_USER: 'GET_USER',
  SIGNIN_WITH_FIREBASE: 'SIGNIN_WITH_FIREBASE',
  GET_USER_LOCAL: 'GET_USER',
  UPDATE_USER_NAME: 'UPDATE_USER_NAME',
  GET_TOP_RACER: 'GET_TOP_RACER',
  UPDATE_USER_PASSWORD: 'UPDATE_USER_PASSWORD',
  UPDATE_RACING: 'UPDATE_RACING',
  RESET_RACING: 'RESET_RACING',
  UPDATE_PRACTISE_RACING: 'UPDATE_PRACTISE_RACING',
  UPDATE_DATA_PRACTICE_INFO: 'UPDATE_DATA_PRACTICE_INFO'
};

export const setError = msg => ({ type: ACTIONS.AUTH_ERROR_SET, payload: msg });

export const receiveLogin = data => ({
  type: ACTIONS.AUTH_LOGIN,
  payload: data
});

export const login = () => ({ type: ACTIONS.AUTH_LOGIN });
export const userLocal = () => ({ type: ACTIONS.GET_USER_LOCAL });

export const signIn = ({
  email = '',
  password = '',
  name = ''
}) => async dispatch => {
  try {
    console.log(TAG, ' - signIn - begin ');
    let response = await ApiService.signIn({ email, password, name });
    console.log(TAG, ' - signIn - response ', response) || {};
    response = response && response['id'] ? response : {};
    dispatch({ type: ACTIONS.AUTH_LOGIN, payload: response });
    return;
  } catch (e) {
    console.log(TAG, ' - signIn - error ', e);
  }
};

export const forGotPass = ({ email = '' }) => async dispatch => {
  try {
    console.log(TAG, ' - forGotPass - begin ');
    let response = await ApiService.signIn({ email, password, name });
    console.log(TAG, ' - forGotPass - response ', response) || {};
    response = response && response['id'] ? response : {};
    dispatch({ type: ACTIONS.AUTH_FORGOT, payload: response });
    return;
  } catch (e) {
    console.log(TAG, ' - forGotPass - error ', e);
  }
};

export const loginWithFirebase = ({
  email = '',
  password = ''
}) => async dispatch => {
  // if (!_.isEmpty(email) && !_.isEmpty(password)) {
  //   let userFirebase = firebase.auth().currentUser;
  //   console.log(
  //     TAG,
  //     ' - loginWithFirebase - email ',
  //     email,
  //     ' - password = ',
  //     password
  //   );
  //   if (_.isEmpty(userFirebase)) {
  //     userFirebase = await firebase
  //       .auth()
  //       .signInAndRetrieveDataWithEmailAndPassword(email, password);
  //   }
  //   console.log(TAG, ' - loginWithFirebase - response ', userFirebase);
  //   dispatch({ type: ACTIONS.SIGNIN_WITH_FIREBASE, payload: userFirebase });
  //   return;
  // }
  dispatch({ type: ACTIONS.SIGNIN_WITH_FIREBASE, payload: {} });
};
export const fetchUser = () => async dispatch => {
  const user = await LocalDatabase.getUserInfo();
  let practiceInfo = await LocalDatabase.getPractiseInfo();
  if (user) {
    dispatch({
      type: ACTIONS.GET_USER,
      payload: user.toJSON(),
      payloadPracticeInfo: practiceInfo
    });
    return;
  } else {
  }
  dispatch({ type: ACTIONS.GET_USER, payload: {} });
};

export const logout = () => async dispatch => {
  try {
    await LocalDatabase.logout();
  } catch (error) {}
  dispatch({
    type: ACTIONS.AUTH_LOGOUT
  });
};
export const updateName = (fullname = '') => async dispatch => {
  try {
    const response = await ApiService.updateName({ fullname: fullname });
    console.log(TAG, ' - updateName - response ', response);

    let user: User = await LocalDatabase.getUserInfo();
    if (!_.isEmpty(response) && user) {
      response.user.Profile['kcal'] = user.Profile.kcal || 0;
      response.user.Profile['miles'] = user.Profile.miles || 0;
    }

    dispatch({ type: ACTIONS.UPDATE_USER_NAME, payload: response?.user || {} });
    return;
  } catch (e) {
    console.log(TAG, ' - updateName - error ', e);
  }
  dispatch({ type: ACTIONS.UPDATE_USER_NAME, payload: {} });
};

export const getTopRacer = () => async dispatch => {
  try {
    const response = await ApiService.leaderBoard();
    console.log(TAG, ' - getTopRacer - response ', response);

    dispatch({ type: ACTIONS.GET_TOP_RACER, payload: response || {} });
    return;
  } catch (e) {
    console.log(TAG, ' - getTopRacer - error ', e);
  }
  dispatch({ type: ACTIONS.GET_TOP_RACER, payload: {} });
};

export const updateDataPracticeInfo = () => async dispatch => {
  try {
    let user: User = await LocalDatabase.getUserInfo();
    if (user) {
      const kcal = user.Profile.kcal || 0;
      const miles = user.Profile.miles || 0;
      const response = await ApiService.practiceArchivement({
        kcals: kcal,
        miles: miles
      });
      console.log(TAG, ' - updateDataPracticeInfo - response ', response);

      dispatch({
        type: ACTIONS.UPDATE_DATA_PRACTICE_INFO,
        payload: response || {}
      });
    }

    return;
  } catch (e) {
    console.log(TAG, ' - updateName - error ', e);
  }
  dispatch({ type: ACTIONS.UPDATE_USER_NAME, payload: {} });
};

export const updatePassword = (cpassword = '', npassword) => async dispatch => {
  try {
    const response = await ApiService.updatePassword({
      cpassword: cpassword,
      npassword: npassword
    });
    console.log(TAG, ' - updateName - response ', response);

    let user: User = await LocalDatabase.getUserInfo();
    if (!_.isEmpty(response) && user) {
      response.user.Profile['kcal'] = user.Profile.kcal || 0;
      response.user.Profile['miles'] = user.Profile.miles || 0;
    }

    dispatch({
      type: ACTIONS.UPDATE_USER_PASSWORD,
      payload: response?.user || {}
    });
    return;
  } catch (e) {
    console.log(TAG, ' - updateName - error ', e);
  }
  dispatch({ type: ACTIONS.UPDATE_USER_PASSWORD, payload: {} });
};

export const updateRacing = ({ kcal = 0, miles = 0 }) => async dispatch => {
  try {
    let user: User = await LocalDatabase.getUserInfo();
    if (user && (kcal !== 0 || miles !== 0)) {
      user.Profile['kcal'] = kcal + (user.Profile.kcal || 0);
      user.Profile['miles'] = miles + (user.Profile.miles || 0);
      console.log(TAG, ' - updateRacing - miles =', user.Profile['miles']);
      await LocalDatabase.saveUserInfo(JSON.stringify(user.toJSON()));
    }
    dispatch({ type: ACTIONS.UPDATE_RACING, payload: user?.toJSON() || {} });

    return;
  } catch (e) {
    console.log(TAG, ' - updateRacing - error ', e);
  }
  dispatch({ type: ACTIONS.UPDATE_RACING, payload: {} });
};

export const updatePractiseRacing = ({
  kcal = 0,
  miles = 0
}) => async dispatch => {
  try {
    let data = { kcal: kcal, miles: miles };
    let practiceInfo = await LocalDatabase.getPractiseInfo();
    if (practiceInfo) {
      data['kcal'] = kcal + (practiceInfo['kcal'] || 0);
      data['miles'] = miles + (practiceInfo['miles'] || 0);
    }
    await LocalDatabase.savePractiseInfo(JSON.stringify(data));
    dispatch({ type: ACTIONS.UPDATE_PRACTISE_RACING, payload: data || {} });
    return;
  } catch (e) {
    console.log(TAG, ' - updatePractiseRacing - error ', e);
  }
  dispatch({ type: ACTIONS.UPDATE_PRACTISE_RACING, payload: {} });
};

export const resetRacing = () => async dispatch => {
  try {
    let data = { kcal: 0, miles: 0 };
    await LocalDatabase.savePractiseInfo(JSON.stringify(data));

    dispatch({ type: ACTIONS.RESET_RACING, payload: data || {} });

    return;
  } catch (e) {
    console.log(TAG, ' - resetRacing - error ', e);
  }
  dispatch({ type: ACTIONS.RESET_RACING, payload: {} });
};
