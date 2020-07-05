import * as Localization from 'react-native-localize';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_DEFAULT } from '../constants';
import resources from './locales';
import i18n from 'i18next';

const defaultPhoneLanguage = Localization.findBestAvailableLanguage([
  LANGUAGE_DEFAULT
]);

i18n.use(initReactI18next).init({
  resources,
  lng: defaultPhoneLanguage?.languageTag,
  fallbackLng: LANGUAGE_DEFAULT,
  interpolation: { escapeValue: false },
  cleanCode: true
});

export default i18n;
