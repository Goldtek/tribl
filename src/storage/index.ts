import AsyncStorage from '@react-native-community/async-storage';
import * as APP_CONSTANTS from '../constants';

class Storage {
  async checkInitialLaunch() {
    const firstTimeLaunch = await AsyncStorage.getItem(
      APP_CONSTANTS.USER_FIRST_LAUNCH
    );

    if (!Boolean(firstTimeLaunch)) return true;

    return true;
  }

  async getUserAuth() {
    const authKeys = (await AsyncStorage.getItem(
      APP_CONSTANTS.USER_AUTH_KEYS
    )) as string;

    const auth = JSON.parse(authKeys) as APP_CONSTANTS.JwtTokenResult | null;
    return auth;
  }

  async addUserAuth(auth: Object | undefined) {
    AsyncStorage.setItem(APP_CONSTANTS.USER_AUTH_KEYS, JSON.stringify(auth));
  }
}

export default new Storage();
