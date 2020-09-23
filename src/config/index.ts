//@ts-nocheck
const {
  SENTRY_KEY,
  CLOUDINARY_NAME,
  FIREBASE_APP_ID,
  FIREBASE_API_KEY,
  CLOUDINARY_PRESET,
  GOOGLE_PLACES_API,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATA_BASEURL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MEASUREMENT_ID,
  TRIBL_WSS_SERVER_BASE_URI,
  TRIBL_HTTP_SERVER_BASE_URI,
  ALGOLIA_PASSPORT_INDEX_NAME,
  ALGOLIA_COMMUNITY_INDEX_NAME,
  FIREBASE_MESSAGING_SENDER_ID,
  ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME,
  ALGOLIA_PASSPORT_LOCATION_INDEX_NAME
} = 'react-native-dotenv';
import Reactotron from 'reactotron-react-native';

// FIX THIS TO USE ENVIRONMENT VARIABLES (APP SECRETES)
const ENVIRONMENT_VARIABLES = {
  TRIBL_HTTP_SERVER_BASE_URI:
    TRIBL_HTTP_SERVER_BASE_URI || __DEV__
      ? 'https://tribl-core-development.herokuapp.com/'
      : 'https://tribl-staging.herokuapp.com/',
  TRIBL_WSS_SERVER_BASE_URI:
    TRIBL_WSS_SERVER_BASE_URI || __DEV__
      ? 'ws://tribl-core-development.herokuapp.com/subscription'
      : 'ws://tribl-staging.herokuapp.com/subscription',
  GOOGLE_PLACES_API:
    GOOGLE_PLACES_API || 'AIzaSyAJR6mSnhyzyvUAsAOQTpAjoZrNayWe880',
  CLOUDINARY_NAME: CLOUDINARY_NAME || 'tribl-for-community',
  CLOUDINARY_PRESET: CLOUDINARY_PRESET || 'nuk7vxt0',
  SENTRY_KEY:
    SENTRY_KEY ||
    'https://6d7c1bb66d134dee968783009c094764@o449418.ingest.sentry.io/5433313',
  ALGOLIA_PASSPORT_INDEX_NAME:
    ALGOLIA_PASSPORT_INDEX_NAME || __DEV__
      ? 'tribl_passport_develop'
      : 'tribl_passport_staging',
  ALGOLIA_COMMUNITY_INDEX_NAME:
    ALGOLIA_COMMUNITY_INDEX_NAME || __DEV__
      ? 'tribl_community_develop'
      : 'tribl_community_staging',
  ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME:
    ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME || __DEV__
      ? 'tribl_community_members_develop'
      : 'tribl_community_members_staging',
  ALGOLIA_PASSPORT_LOCATION_INDEX_NAME:
    ALGOLIA_PASSPORT_LOCATION_INDEX_NAME || __DEV__
      ? 'tribl_passport_location_develop'
      : 'tribl_passport_location_staging',
  FIREBASE_PROJECT_ID:
    FIREBASE_PROJECT_ID || __DEV__ ? 'tribl-2020' : 'tribl-staging',
  FIREBASE_MEASUREMENT_ID:
    FIREBASE_MEASUREMENT_ID || __DEV__ ? 'G-S6QECWH2QH' : 'G-TEDF6R5XCB',
  FIREBASE_MESSAGING_SENDER_ID:
    FIREBASE_MESSAGING_SENDER_ID || __DEV__ ? '354137256334' : '971011241618',
  FIREBASE_STORAGE_BUCKET:
    FIREBASE_STORAGE_BUCKET || __DEV__
      ? 'tribl-2020.appspot.com'
      : 'tribl-staging.appspot.com',
  FIREBASE_AUTH_DOMAIN:
    FIREBASE_AUTH_DOMAIN || __DEV__
      ? 'tribl-2020.firebaseapp.com'
      : 'tribl-staging.firebaseapp.com',
  FIREBASE_API_KEY:
    FIREBASE_API_KEY || __DEV__
      ? 'AIzaSyDs1Q37-tCo16NzK5MkZn3Jp7WtgK_P8dA'
      : 'AIzaSyBejHNRT6SCSgNFqWWpqsEyu5FlllXeBT0',
  FIREBASE_APP_ID:
    FIREBASE_APP_ID || __DEV__
      ? '1:354137256334:web:d1ebf6584c1b42ff94b4df'
      : '1:971011241618:web:def6dc651e31a54ac4d84b',
  FIREBASE_DATA_BASEURL:
    FIREBASE_DATA_BASEURL || __DEV__
      ? 'https://tribl-2020.firebaseio.com'
      : 'https://tribl-staging.firebaseio.com'
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
