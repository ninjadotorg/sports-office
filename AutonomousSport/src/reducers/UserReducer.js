import { ACTIONS } from '@/actions/UserAction';
import _ from 'lodash';
import LocalDatabase from '@/utils/LocalDatabase';
import ApiService from '@/services/ApiService';

const initialState = { userInfo: {} };
const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.AUTH_LOGIN: {
      break;
    }

    case ACTIONS.AUTH_UPDATE: {
      break;
    }
    case ACTIONS.GET_USER: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload)) {
        ApiService.token = payload.token;
        LocalDatabase.saveUserInfo(payload);
      }
      return { ...state, userInfo: payload };
    }

    default:
      return state;
  }
};

export default UserReducer;
