import MMKVStorage from 'react-native-mmkv-storage';
import { USER_FIRST_LAUNCH, USER_REG_INFO } from '../../constants';
import { DEVICE_ID } from '../../utils/device';
import { VerifyOTPIT, RegistrationInfo } from '../../graphql/types';

class Storage {
  public MMKV: MMKVStorage.API | null = null;

  constructor() {
    this.MMKV = new MMKVStorage.Loader().withEncryption().initialize();
  }

  async checkInitialLaunch() {
    return this.MMKV?.getBoolAsync(USER_FIRST_LAUNCH);
  }

  async clearStorage() {
    return this.MMKV?.clearStore();
  }

  async setInitialLaunch() {
    return this.MMKV?.setBoolAsync(USER_FIRST_LAUNCH, true);
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
}

export default new Storage();
