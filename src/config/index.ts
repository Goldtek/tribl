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
  TRIBL_SERVER_BASE_URI,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MEASUREMENT_ID,
  ALGOLIA_PASSPORT_INDEX_NAME,
  ALGOLIA_COMMUNITY_INDEX_NAME,
  FIREBASE_MESSAGING_SENDER_ID,
  ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME,
  ALGOLIA_PASSPORT_LOCATION_INDEX_NAME
} = 'react-native-dotenv';
import Reactotron from 'reactotron-react-native';

// FIX THIS TO USE ENVIRONMENT VARIABLES (APP SECRETES)
const ENVIRONMENT_VARIABLES = {
  TRIBL_SERVER_BASE_URI:
    TRIBL_SERVER_BASE_URI || __DEV__
      ? 'tribl-core-development.herokuapp.com/'
      : 'tribl-staging.herokuapp.com/',
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
    ALGOLIA_PASSPORT_LOCATION_INDEX_NAME || 'tribl_passport_location_staging',
  FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID || 'tribl-staging',
  FIREBASE_MEASUREMENT_ID: FIREBASE_MEASUREMENT_ID || 'G-TEDF6R5XCB',
  FIREBASE_MESSAGING_SENDER_ID: FIREBASE_MESSAGING_SENDER_ID || '971011241618',
  FIREBASE_STORAGE_BUCKET:
    FIREBASE_STORAGE_BUCKET || 'tribl-staging.appspot.com',
  FIREBASE_AUTH_DOMAIN: FIREBASE_AUTH_DOMAIN || 'tribl-staging.firebaseapp.com',
  FIREBASE_API_KEY:
    FIREBASE_API_KEY || 'AIzaSyBejHNRT6SCSgNFqWWpqsEyu5FlllXeBT0',
  FIREBASE_APP_ID:
    FIREBASE_APP_ID || '1:971011241618:web:def6dc651e31a54ac4d84b',
  FIREBASE_DATA_BASEURL:
    FIREBASE_DATA_BASEURL || 'https://tribl-staging.firebaseio.com'
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
