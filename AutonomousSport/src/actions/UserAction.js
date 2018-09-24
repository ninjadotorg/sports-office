import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import User from '@/models/User';
import Util from '@/utils/Util';
import _ from 'lodash';

const TAG = 'UserAction';
export const ACTIONS = {
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_UPDATE: 'AUTH_UPDATE',
  GET_USER: 'GET_USER',
  GET_USER_LOCAL: 'GET_USER',
  UPDATE_USER_NAME: 'UPDATE_USER_NAME',
  UPDATE_RACING: 'UPDATE_RACING',
  RESET_RACING: 'RESET_RACING',
  UPDATE_PRACTISE_RACING: 'UPDATE_PRACTISE_RACING'
};

export const setError = msg => ({ type: ACTIONS.AUTH_ERROR_SET, payload: msg });

export const receiveLogin = data => ({
  type: ACTIONS.AUTH_LOGIN,
  payload: data
});

export const logout = () => ({ type: ACTIONS.AUTH_LOGOUT });
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
export const fetchUser = () => async dispatch => {
  const user = await LocalDatabase.getUserInfo();
  if (user) {
    dispatch({ type: ACTIONS.GET_USER, payload: user.toJSON() });
    return;
  } else {
  }
  dispatch({ type: ACTIONS.GET_USER, payload: {} });
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

export const updateRacing = ({ kcal = 0, miles = 0 }) => async dispatch => {
  try {
    let user: User = await LocalDatabase.getUserInfo();
    if (user) {
      user.Profile['kcal'] = kcal + (user.Profile.kcal || 0);
      user.Profile['miles'] = miles + (user.Profile.miles || 0);
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
