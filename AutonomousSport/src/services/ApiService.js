import { Platform } from 'react-native';
import Api from '@/services/Api';
import METHOD from '@/services/Method';
import Util from '@/utils/Util';
// import _ from 'lodash';
import Room from '@/models/Room';
import LocalDatabase from '@/utils/LocalDatabase';

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
        const res = await fetch(URL, {
          method,
          headers: {
            Accept: 'application/json',
            Authorization
          }
        });
        const resJson = await res.json();
        console.log('Response data:', resJson);
        return resJson;
      } catch (error) {
        console.error(error);
        return error;
      }
    } else if (method === METHOD.POST) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization
          },
          body: this.buildFormData(params)
        });
        const resJson = await res.json();
        // console.log('Response data:', resJson);
        return resJson;
      } catch (error) {
        console.error(error);
        return error;
      }
    } else if (method === METHOD.DELETE) {
      try {
        const URL = ApiService.buildUrl(url, params);
        const res = await fetch(URL, {
          method: 'delete',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const resJson = await res.json();
        return resJson;
      } catch (error) {
        console.error(error);
        return error;
      }
    }
  }

  static async signIn({ email = '', password = '' }) {
    const url = Api.SIGN_IN;
    const response = await ApiService.getURL(METHOD.POST, url, {
      email,
      password
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
  static async createRoom(): Room {
    const url = Api.CREATE_ROOM;
    const response = await ApiService.getURL(METHOD.GET, url, {});
    return response ? new Room(response) : null;
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
    const listRoom =
      response?.list?.map(item => {
        return new Room(item);
      }) || [];
    return listRoom;
  }

  static async joinRoom({ session = '' }) {
    const url = Api.JOIN_ROOM;
    const response = await ApiService.getURL(METHOD.POST, url, {
      session: session
    });
    console.log(TAG, ' - joinRoom = ', response);
    return response;
  }
}
