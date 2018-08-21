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
  GET_USER_LOCAL: 'GET_USER'
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
    const response = await ApiService.signIn({ email, password, name });
    console.log(TAG, ' - signIn - response ', response);
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
    // try {
    //   const response = await ApiService.signIn(Util.createDataForSignIn());
    //   console.log(TAG, ' - fetchUser - response ', response);
    //   dispatch({ type: ACTIONS.GET_USER, payload: response });
    //   return;
    // } catch (e) {
    //   console.log(TAG, ' - fetchData - error ', e);
    // }
  }
  dispatch({ type: ACTIONS.GET_USER, payload: {} });
};
