import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
// import User from '@/models/User';
import Util from '@/utils/Util';

const TAG = 'UserAction';
export const ACTIONS = {
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_UPDATE: 'AUTH_UPDATE',
  GET_USER: 'GET_USER',
  GET_USER_LOCAL: 'GET_USER',
  UPDATE_USER_NAME: 'UPDATE_USER_NAME'
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
    dispatch({ type: ACTIONS.UPDATE_USER_NAME, payload: response?.user || {} });
    return;
  } catch (e) {
    console.log(TAG, ' - updateName - error ', e);
  }
  dispatch({ type: ACTIONS.UPDATE_USER_NAME, payload: {} });
};
