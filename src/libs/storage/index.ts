import MMKVStorage from 'react-native-mmkv-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_ID } from '../../utils/device';
import {
  USER_FIRST_LAUNCH,
  USER_REG_INFO,
  USER_PASSPORT_INFO,
  SHOW_MODAL
} from '../../constants';
import {
  VerifyOTPIT,
  RegistrationInfo,
  PassportInterface,
  ShowModal
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
        ...regInfo,
        user: { ...userRegInfo.user, ...regInfo?.user }
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

  async checkTagModal() {
    return this.MMKV?.getMapAsync(SHOW_MODAL) as Promise<ShowModal>;
  }

  async setTagModal(id?: ShowModal) {
    try {
      const tagModal = await this.checkTagModal();
      let data = { community: [...tagModal.community, ...id?.community!] };
      await this.MMKV?.setMapAsync(SHOW_MODAL, data);
    } catch (error) {
      await this.MMKV?.setMapAsync(SHOW_MODAL, { ...id! });
    }
  }

  async removeTagModal(community?: string) {
    try {
      const currentTagModal = await this.checkTagModal();
      let communityIndex = null;
      if (currentTagModal.community?.length === 0) {
        await this.setTagModal({ community: [] });
        await this.MMKV?.setMapAsync(SHOW_MODAL, { community: [] });
      }
      if (currentTagModal.community.length === 1) {
        currentTagModal.community.pop();
        await this.setTagModal({ community: [] });
        await this.MMKV?.setMapAsync(SHOW_MODAL, { community: [] });
      }
      if (currentTagModal.community.length) {
        //Remove community from tagModal
        const filteredId = currentTagModal?.community?.filter(
          (id) => id !== community
        );
        //Set tag modal to updated version
        await this.setTagModal({ community: filteredId });
        await this.MMKV?.setMapAsync(SHOW_MODAL, { community: filteredId });
      }
    } catch (error) {
      await this.MMKV?.setMapAsync(SHOW_MODAL, []);
    }
  }
}

export default new Storage();
