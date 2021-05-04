import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_ID } from '../../utils/device';
import {
  USER_EULA,
  SHOW_MODAL,
  USER_REG_INFO,
  USER_PASSPORT_INFO,
  USER_FIRST_LAUNCH,
  LOCAL_GIPHY_CACHE
} from '../../constants';
import {
  VerifyOTPIT,
  RegistrationInfo,
  PassportInterface,
  ShowModal
} from '../../graphql/types';
import { GiphyInterface } from '../../stream/types';

class Storage {
  async checkInitialLaunch() {
    return AsyncStorage.getItem(USER_FIRST_LAUNCH);
  }

  async checkEULA() {
    return AsyncStorage.getItem(USER_EULA);
  }

  async clearStorage() {
    return AsyncStorage.clear();
  }

  async setInitialLaunch() {
    return AsyncStorage.setItem(USER_FIRST_LAUNCH, '1');
  }

  async setEULA() {
    return AsyncStorage.setItem(USER_EULA, '1');
  }

  async getUserCredentials() {
    return AsyncStorage.getItem(DEVICE_ID);
  }

  async setUserRegistration(regInfo: RegistrationInfo) {
    const storageData = await this.getUserRegistration();

    if (!storageData) {
      return AsyncStorage.setItem(USER_REG_INFO, JSON.stringify(regInfo));
    }

    const userRegInfo = JSON.parse(storageData) as RegistrationInfo;

    await AsyncStorage.setItem(
      USER_REG_INFO,
      JSON.stringify({
        ...userRegInfo,
        ...regInfo,
        user: { ...userRegInfo?.user, ...regInfo?.user }
      })
    );
  }

  async getUserRegistration() {
    return AsyncStorage.getItem(USER_REG_INFO);
  }

  async setUserCredentials(credentials?: VerifyOTPIT) {
    const storageData = await this.getUserCredentials();

    if (!storageData) {
      return await AsyncStorage.setItem(
        DEVICE_ID,
        JSON.stringify({ ...credentials })
      );
    }

    const userCredentials = JSON.parse(storageData) as VerifyOTPIT;

    await AsyncStorage.setItem(
      DEVICE_ID,
      JSON.stringify({ ...userCredentials, ...credentials })
    );
  }

  async setUserPassport(passport?: PassportInterface) {
    const storageData = await this.getUserPassport();

    if (!storageData) {
      return await AsyncStorage.setItem(
        USER_PASSPORT_INFO,
        JSON.stringify({ ...passport })
      );
    }

    const userPassport = JSON.parse(storageData) as PassportInterface;

    await AsyncStorage.setItem(
      USER_PASSPORT_INFO,
      JSON.stringify({ ...userPassport, ...passport })
    );
  }

  async getUserPassport() {
    return AsyncStorage.getItem(USER_PASSPORT_INFO);
  }

  async getTagModal() {
    return AsyncStorage.getItem(SHOW_MODAL);
  }

  async getGiphys() {
    return AsyncStorage.getItem(LOCAL_GIPHY_CACHE);
  }

  async setGiphys(giphy: GiphyInterface) {
    return AsyncStorage.setItem(
      LOCAL_GIPHY_CACHE,
      JSON.stringify({ ...giphy })
    );
  }

  async setTagModal(id?: ShowModal) {
    const storageData = await this.getTagModal();
    if (!storageData) {
      return await AsyncStorage.setItem(SHOW_MODAL, JSON.stringify({ ...id! }));
    }
    const tagModal = JSON.parse(storageData) as ShowModal;
    const data = { community: [...tagModal.community, ...id?.community!] };
    await AsyncStorage.setItem(SHOW_MODAL, JSON.stringify(data));
  }

  async removeTagModal(community?: string) {
    const storageData = await this.getTagModal();

    if (!storageData) return;

    const currentTagModal = JSON.parse(storageData) as ShowModal;

    if (currentTagModal.community?.length === 0) {
      const data = { community: [] };
      await AsyncStorage.setItem(SHOW_MODAL, JSON.stringify(data));
    }

    if (currentTagModal.community.length === 1) {
      currentTagModal.community.pop();
      const data = { community: [] };
      await AsyncStorage.setItem(SHOW_MODAL, JSON.stringify(data));
    }

    if (currentTagModal.community.length) {
      //Remove community from tagModal
      const filteredId = currentTagModal?.community?.filter(
        (id) => id !== community
      );
      //Set tag modal to updated version
      const data = { community: filteredId };
      await AsyncStorage.setItem(SHOW_MODAL, JSON.stringify(data));
    }
  }
}

export default new Storage();
