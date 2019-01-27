import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import Util from '@/utils/Util';
import _ from 'lodash';
import CommandP2P from '@/models/CommandP2P';

const TAG = 'P2PAction';
export const ACTIONS = {
  SET_UP_PEER_CONNECTION: 'SET_UP_PEER_CONNECTION',
  NOTIFY_MESSAGE: 'SEND_MESSAGE',
  CLOSE_PEER_CONNECTION: 'CLOSE_PEER_CONNECTION'
};

export const notifyMessage = (message: CommandP2P) => async dispatch => {
  if (message) {
    dispatch({ type: ACTIONS.NOTIFY_MESSAGE, payload: message.toJSON() });
  }
};
