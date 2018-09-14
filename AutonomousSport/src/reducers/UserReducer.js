import { ACTIONS } from '@/actions/UserAction';
import _ from 'lodash';
import LocalDatabase from '@/utils/LocalDatabase';
import ApiService from '@/services/ApiService';

const TAG = 'UserReceducer';
const initialState = { userInfo: {} };
const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.AUTH_LOGIN: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload)) {
        ApiService.token = payload.token;
        LocalDatabase.saveUserInfo(JSON.stringify(payload));
      }
      return { ...state, userInfo: payload };
    }

    case ACTIONS.AUTH_UPDATE: {
      break;
    }
    case ACTIONS.GET_USER: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload)) {
        console.log(TAG, ' UserReducer-GET_USER payload = ', payload);
        ApiService.token = payload.token;
      }
      return { ...state, userInfo: payload };
    }
    case ACTIONS.UPDATE_USER_NAME: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload)) {
        console.log(TAG, ' UserReducer-UPDATE_USER_NAME payload = ', payload);
        // save local
        LocalDatabase.saveUserInfo(JSON.stringify(payload));
      }
      return { ...state, userInfo: payload };
    }
    case ACTIONS.UPDATE_RACING: {
      const payload = action.payload || {};
      return { ...state, userInfo: payload };
    }

    default:
      return state;
  }
};

export default UserReducer;
