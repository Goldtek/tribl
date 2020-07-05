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
}

export default new Storage();
