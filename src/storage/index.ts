import AsyncStorage from '@react-native-community/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as APP_CONSTANTS from '../constants';
import { DEVICE_ID } from '../utils/device';
import { VerifyOTPIT } from '../graphql/types';

class Storage {
  protected credentialInstance: VerifyOTPIT | null = null;
  protected initialLaunch: boolean = false;

  async checkInitialLaunch() {
    const firstTimeLaunch = await AsyncStorage.getItem(
      APP_CONSTANTS.USER_FIRST_LAUNCH
    );

    this.initialLaunch = Boolean(Number(firstTimeLaunch));
  }

  getInitialLaunch() {
    return this.initialLaunch;
  }

  async setInitialLaunch() {
    return AsyncStorage.setItem(APP_CONSTANTS.USER_FIRST_LAUNCH, '1');
  }

  async checkUserCredentials() {
    if (this.credentialInstance) {
      return this.credentialInstance;
    }

    const credentials = await SecureStore.getItemAsync(DEVICE_ID);

    if (!credentials) return null;

    const authCredentials = JSON.parse(credentials) as VerifyOTPIT;
    this.credentialInstance = authCredentials;
    return authCredentials;
  }

  getUserCredentials() {
    return this.credentialInstance;
  }

  setUserCredentials(credentials: VerifyOTPIT) {
    this.credentialInstance = { ...this.credentialInstance, ...credentials };
    this.setUserSecuredCredentials();
  }

  async setUserSecuredCredentials() {
    return Promise.all([
      SecureStore.deleteItemAsync(DEVICE_ID),
      SecureStore.setItemAsync(
        DEVICE_ID,
        JSON.stringify(this.credentialInstance)
      )
    ]);
  }
}
export default new Storage();
