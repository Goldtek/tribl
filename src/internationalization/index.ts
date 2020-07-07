import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { LANGUAGE_DEFAULT } from '../constants';
import { DEVICE_DEFAULT_LANGUAGE } from '../utils/device';
import resources from './locales';

i18n.use(initReactI18next).init({
  resources,
  lng: DEVICE_DEFAULT_LANGUAGE,
  fallbackLng: LANGUAGE_DEFAULT,
  interpolation: { escapeValue: false },
  cleanCode: true
});

export default i18n;
