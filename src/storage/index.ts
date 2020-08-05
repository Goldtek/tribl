import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import * as APP_CONSTANTS from '../constants';
import { DEVICE_ID } from '../utils/device';
import { VerifyOTPIT, Credentials } from '../graphql/types';

class Storage {
  async checkInitialLaunch() {
    const firstTimeLaunch = await AsyncStorage.getItem(
      APP_CONSTANTS.USER_FIRST_LAUNCH
    );

    return Boolean(Number(firstTimeLaunch));
  }

  async setInitialLaunch() {
    return AsyncStorage.setItem(APP_CONSTANTS.USER_FIRST_LAUNCH, '0');
  }

  async getUserCredentials(): Promise<false | Credentials> {
    return Keychain.getInternetCredentials(DEVICE_ID);
  }

  async setUserCredentials({ id_token, refresh_token }: VerifyOTPIT) {
    return Promise.all([
      Keychain.resetInternetCredentials(DEVICE_ID),
      Keychain.setInternetCredentials(DEVICE_ID, id_token, refresh_token)
    ]);
  }
}

export default new Storage();
