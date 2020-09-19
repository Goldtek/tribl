//@ts-nocheck
const {
  TRIBL_SERVER_BASE_URI,
  GOOGLE_PLACES_API,
  CLOUDINARY_NAME,
  CLOUDINARY_PRESET,
  SENTRY_KEY,
  ALGOLIA_PASSPORT_INDEX_NAME,
  ALGOLIA_COMMUNITY_INDEX_NAME,
  ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME,
  ALGOLIA_PASSPORT_LOCATION_INDEX_NAME
} = 'react-native-dotenv';
import Reactotron from 'reactotron-react-native';

// FIX THIS TO USE ENVIRONMENT VARIABLES (APP SECRETES)
const ENVIRONMENT_VARIABLES = {
  TRIBL_SERVER_BASE_URI:
    TRIBL_SERVER_BASE_URI || 'tribl-core-development.herokuapp.com/',
  GOOGLE_PLACES_API:
    GOOGLE_PLACES_API || 'AIzaSyAJR6mSnhyzyvUAsAOQTpAjoZrNayWe880',
  CLOUDINARY_NAME: CLOUDINARY_NAME || 'tribl-for-community',
  CLOUDINARY_PRESET: CLOUDINARY_PRESET || 'nuk7vxt0',
  SENTRY_KEY:
    SENTRY_KEY ||
    'https://6d7c1bb66d134dee968783009c094764@o449418.ingest.sentry.io/5433313',
  ALGOLIA_PASSPORT_INDEX_NAME:
    ALGOLIA_PASSPORT_INDEX_NAME || 'tribl_passport_staging',
  ALGOLIA_COMMUNITY_INDEX_NAME:
    ALGOLIA_COMMUNITY_INDEX_NAME || 'tribl_community_staging',
  ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME:
    ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME || 'tribl_community_members_staging',
  ALGOLIA_PASSPORT_LOCATION_INDEX_NAME:
    ALGOLIA_PASSPORT_LOCATION_INDEX_NAME || 'tribl_passport_location_staging'
};

declare global {
  interface Console {
    tron: (...args: any[]) => void;
  }
}

if (__DEV__) {
  Reactotron.configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .connect(); // let's connect!

  console.tron = Reactotron.log;
}

export default ENVIRONMENT_VARIABLES;
