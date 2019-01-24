import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import Util from '@/utils/Util';
import _ from 'lodash';

const TAG = 'P2PAction';
export const ACTIONS = {
  SET_UP_PEER_CONNECTION: 'SET_UP_PEER_CONNECTION',
  CLOSE_PEER_CONNECTION: 'CLOSE_PEER_CONNECTION'
};

export const setupPeer = () => async dispatch => {};
