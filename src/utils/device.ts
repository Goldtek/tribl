import * as Localization from 'react-native-localize';
import { Dimensions, Platform } from 'react-native';
import { getUniqueId, getVersion } from 'react-native-device-info';
const { countryCode, languageCode } = Localization.getLocales()[0];

const { width, height } = Dimensions.get('window');

export const DEVICE_OS = Platform.OS;
export const DEVICE_ID = getUniqueId();
export const APP_VERSION = getVersion();
export const DEVICE_DEFAULT_COUNTRY = countryCode.toLowerCase();
export const DEVICE_DEFAULT_LANGUAGE = languageCode;
export const DEVICE_FULL_WIDTH = Math.ceil(width);
export const DEVICE_FULL_HEIGHT = Math.ceil(height);
