import { Platform } from 'react-native';
import Api from '@/services/Api';
import METHOD from '@/services/Method';
import Util from '@/utils/Util';
import _ from 'lodash';
import Room from '@/models/Room';
import LocalDatabase from '@/utils/LocalDatabase';

const TIME_OUT_API = 8;
const TAG = 'ApiService';
export default class ApiService {
  static token = '';

  static buildUrl(url, parameters) {
    let qs = '';
    for (const key in parameters) {
      const value = parameters[key];
      qs += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
    if (qs.length > 0) {
      qs = qs.substring(0, qs.length - 1); // chop off last "&"
      url = `${url}?${qs}`;
    }
    return url;
  }

  static serializeJSON(data) {
    return Object.keys(data)
      .map(function(keyName) {
        return (
          encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
        );
      })
      .join('&');
  }

  static buildFormData(params) {
    let formData = new FormData();
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });
    return formData;
  }

  static async getNormalUrl(method, url, params) {
    const URL = ApiService.buildUrl(url, params);
    const res = await fetch(URL, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const resJson = await res.json();
    return resJson;
  }

  static async getURL(method, url, params) {
    console.log('getURL :', url);
    console.log('getURL Params:', params);

    if (!ApiService.token) {
      ApiService.token = await LocalDatabase.getUserAccessToken();
      console.log(TAG, ' getURL token =', ApiService.token);
    }
    const Authorization = `Bearer ${ApiService.token}`;

    if (method === METHOD.GET || method === METHOD.PUT) {
      try {
        const URL = ApiService.buildUrl(url, params);
        // console.log('URL build :', URL);
        const res = await Util.excuteWithTimeout(
          fetch(URL, {
            method,
            headers: {
              Accept: 'application/json',
              Authorization: Authorization
            }
          }),
          TIME_OUT_API
        );
        const resJson = (await res?.json()) || {};
        console.log('Response data:', resJson);
        return resJson;
      } catch (error) {
        // console.error(error);
        return {};
      }
    } else if (method === METHOD.POST) {
      try {
        const res = await Util.excuteWithTimeout(
          fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              Authorization: Authorization
            },
            body: this.buildFormData(params)
          }),
          TIME_OUT_API
        );
        const resJson = (await res?.json()) || {};
        // const res = await fetch(url, {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'multipart/form-data',
        //     Authorization
        //   },
        //   body: this.buildFormData(params)
        // });
        // const resJson = await res.json();
        console.log('Response data:', resJson);
        return resJson;
      } catch (error) {
        console.warn(error);
        return error;
      }
    } else if (method === METHOD.DELETE) {
      try {
        const URL = ApiService.buildUrl(url, params);
        const res = await Util.excuteWithTimeout(
          fetch(URL, {
            method: 'delete',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }),
          TIME_OUT_API
        );
        const resJson = (await res?.json()) || {};

        // const res = await fetch(URL, {
        //   method: 'delete',
        //   credentials: 'include',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const resJson = await res.json();
        return resJson;
      } catch (error) {
        console.warn(error);
        return error;
      }
    }
  }

  static async forGotPass({ email = '' }) {
    const url = Api.FORGOT_PASS;
    const response = await ApiService.getURL(METHOD.POST, url, {
      email
    });
    return response;
  }

  static async signIn({ email = '', password = '', name }) {
    const url = Api.SIGN_IN;
    const response = await ApiService.getURL(METHOD.POST, url, {
      email,
      password,
      fullname: name
    });
    return response;
  }
  static async updateName({ fullname = '' }) {
    const url = Api.UPDATE_NAME;
    const response = await ApiService.getURL(METHOD.POST, url, {
      fullname
    });
    return response;
  }
  static async signUp({ email = '', password = '', fullname = '' }) {
    const url = Api.SIGN_UP;
    const response = await ApiService.getURL(METHOD.POST, url, {
      email,
      password,
      fullname
    });
    return response;
  }
  static async createRoom({
    mapId = -1,
    loop = 1,
    miles = 0,
    name = ''
  }): Room {
    const url = Api.CREATE_ROOM;
    const response = await ApiService.getURL(METHOD.POST, url, {
      mapId,
      loop,
      miles,
      name
    });
    return !_.isEmpty(response) ? new Room(response?.room) : null;
  }

  static async leftRoom({ session = '' }) {
    if (session) {
      const url = Api.LEFT_ROOM;
      const response = await ApiService.getURL(METHOD.POST, url, {
        session: session
      });
      return response;
    }
    return {};
  }

  static async finishedRoom({ session = '' }) {
    if (session) {
      const url = Api.FINISH_ROOM;
      const response = await ApiService.getURL(METHOD.POST, url, {
        session: session
      });
      return response;
    }
    return {};
  }

  static async getRoomList({ page = 1, page_size = 10 }) {
    // if (__DEV__) {
    //   return ;
    // }
    const url = Api.GET_LIST_ROOM;
    const response = await ApiService.getURL(METHOD.GET, url, {
      page,
      page_size
    });
    console.log(TAG, ' - getRoomList = ', response);
    return response;
    // const listRoom =
    //   response?.list?.map(item => {
    //     return new Room(item);
    //   }) || [];
    // return listRoom;
  }

  static async getAllUser({ offset = 0, limit = 12, search = '' }) {
    const url = Api.GET_ALL_USER;
    const response = await ApiService.getURL(METHOD.GET, url, {
      offset,
      limit,
      search
    });
    // console.log(TAG, ' - getAllUser = ', response);
    return response || {};
  }

  static async getAllFriend({ offset = 0, limit = 12, search = '' }) {
    const url = Api.GET_ALL_FRIEND;
    const response = await ApiService.getURL(METHOD.GET, url, {
      offset,
      limit,
      search
    });

    return response || {};
  }

  static async getMapList({ offset = 0, limit = 12 }) {
    const url = Api.GET_ALL_MAP;
    const response = await ApiService.getURL(METHOD.GET, url, {});
    // console.log(TAG, ' - getMapList = ', response);
    return response || {};
  }

  static async joinRoom({ session = '' }): {} {
    const url = Api.JOIN_ROOM;
    const response = await ApiService.getURL(METHOD.POST, url, {
      session: session
    });
    console.log(TAG, ' - joinRoom = ', response);
    return response;
  }

  static async joinRandomRoom({}): Room {
    const url = Api.JOIN_RANDOM_ROOM;
    // const response = await ApiService.getURL(METHOD.GET, url, {
    //   session: session
    // });
    const response = await ApiService.getURL(METHOD.GET, url, {});

    console.log(TAG, ' - joinRandomRoom = ', response);
    return !_.isEmpty(response) ? new Room(response?.room) : null;
  }

  static async startRacing({ session }): Room {
    const url = Api.START_RACING;
    const response = await ApiService.getURL(METHOD.POST, url, {
      session: session
    });

    console.log(TAG, ' - startRacing = ', response);
    return !_.isEmpty(response) && !_.isEmpty(response?.room)
      ? new Room(response?.room)
      : null;
  }

  static async makeFriend({ friendId = -1 }) {
    const url = Api.MAKE_FRIEND;
    const response = await ApiService.getURL(METHOD.POST, url, {
      friendId: friendId
    });
    console.log(TAG, ' - makeFriend = ', response);
    return response;
  }

  //ROOM_INVITE
  static async sendInviteRoom({ userid = -1, session = '' }) {
    const url = Api.ROOM_INVITE;
    const response = await ApiService.getURL(METHOD.POST, url, {
      userid: userid,
      session: session
    });
    console.log(TAG, ' - onPressInviteChangeName = ', response);
    return response;
  }

  //ROOM_UPDATE_NAME
  static async sendUpdateRoomName({ name = '', session = '' }) {
    const url = Api.ROOM_UPDATE_NAME;
    const response = await ApiService.getURL(METHOD.POST, url, {
      name: name,
      session: session
    });
    console.log(TAG, ' - onPressInviteChangeName = ', response);
    return response;
  }
}
