import MMKVStorage from 'react-native-mmkv-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_ID } from '../../utils/device';
import {
  USER_FIRST_LAUNCH,
  USER_REG_INFO,
  USER_PASSPORT_INFO
} from '../../constants';
import {
  VerifyOTPIT,
  RegistrationInfo,
  PassportInterface
} from '../../graphql/types';

class Storage {
  public MMKV: MMKVStorage.API | null = null;

  constructor() {
    this.MMKV = new MMKVStorage.Loader().withEncryption().initialize();
  }

  async checkInitialLaunch() {
    return AsyncStorage.getItem(USER_FIRST_LAUNCH);
  }

  async clearStorage() {
    return this.MMKV?.clearStore();
  }

  async setInitialLaunch() {
    return AsyncStorage.setItem(USER_FIRST_LAUNCH, '1');
  }

  async getUserCredentials() {
    return this.MMKV?.getMapAsync(DEVICE_ID) as Promise<VerifyOTPIT>;
  }

  async setUserRegistration(regInfo: RegistrationInfo) {
    try {
      const userRegInfo = await this.getUserRegistration();
      await this.MMKV?.setMapAsync(USER_REG_INFO, {
        ...userRegInfo,
        ...regInfo
      });
    } catch (error) {
      return this.MMKV?.setMapAsync(USER_REG_INFO, regInfo);
    }
  }

  async getUserRegistration() {
    return this.MMKV?.getMapAsync(USER_REG_INFO) as Promise<RegistrationInfo>;
  }

  async setUserCredentials(credentials?: VerifyOTPIT) {
    try {
      const userCredentials = await this.getUserCredentials();
      await this.MMKV?.setMapAsync(DEVICE_ID, {
        ...userCredentials,
        ...credentials
      });
    } catch (error) {
      await this.MMKV?.setMapAsync(DEVICE_ID, { ...credentials });
    }
  }

  async setUserPassport(passport?: PassportInterface) {
    try {
      const userPassport = await this.getUserPassport();
      await this.MMKV?.setMapAsync(USER_PASSPORT_INFO, {
        ...userPassport,
        ...passport
      });
    } catch (error) {
      await this.MMKV?.setMapAsync(USER_PASSPORT_INFO, { ...passport });
    }
  }

  async getUserPassport() {
    return this.MMKV?.getMapAsync(USER_PASSPORT_INFO) as Promise<
      PassportInterface
    >;
  }
}

export default new Storage();
