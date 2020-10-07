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
const DEVELOPMENT_ENV = {
  TRIBL_HTTP_SERVER_BASE_URI: 'https://tribl-core-development.herokuapp.com/',
  TRIBL_WSS_SERVER_BASE_URI:
    'ws://tribl-core-development.herokuapp.com/subscription',
  GOOGLE_PLACES_API: 'AIzaSyAJR6mSnhyzyvUAsAOQTpAjoZrNayWe880',
  CLOUDINARY_NAME: 'tribl-for-community',
  CLOUDINARY_PRESET: 'nuk7vxt0',
  SENTRY_KEY:
    'https://6d7c1bb66d134dee968783009c094764@o449418.ingest.sentry.io/5433313',
  ALGOLIA_PASSPORT_INDEX_NAME: 'tribl_passport_develop',
  ALGOLIA_COMMUNITY_INDEX_NAME: 'tribl_community_develop',
  ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME: 'tribl_community_members_develop',
  ALGOLIA_PASSPORT_LOCATION_INDEX_NAME: 'tribl_passport_location_develop',
  FIREBASE_PROJECT_ID: 'tribl-2020',
  FIREBASE_MEASUREMENT_ID: 'G-S6QECWH2QH',
  FIREBASE_MESSAGING_SENDER_ID: '354137256334',
  FIREBASE_STORAGE_BUCKET: 'tribl-2020.appspot.com',
  FIREBASE_AUTH_DOMAIN: 'tribl-2020.firebaseapp.com',
  FIREBASE_API_KEY: 'AIzaSyDs1Q37-tCo16NzK5MkZn3Jp7WtgK_P8dA',
  FIREBASE_APP_ID: '1:354137256334:web:d1ebf6584c1b42ff94b4df',
  FIREBASE_DATA_BASEURL: 'https://tribl-staging.firebaseio.com'
};

const STAGING_ENV = {
  TRIBL_HTTP_SERVER_BASE_URI: 'https://tribl-staging.herokuapp.com/',
  TRIBL_WSS_SERVER_BASE_URI: 'ws://tribl-staging.herokuapp.com/subscription',
  GOOGLE_PLACES_API: 'AIzaSyAJR6mSnhyzyvUAsAOQTpAjoZrNayWe880',
  CLOUDINARY_NAME: 'tribl-for-community',
  CLOUDINARY_PRESET: 'nuk7vxt0',
  SENTRY_KEY:
    'https://6d7c1bb66d134dee968783009c094764@o449418.ingest.sentry.io/5433313',
  ALGOLIA_PASSPORT_INDEX_NAME: 'tribl_passport_staging',
  ALGOLIA_COMMUNITY_INDEX_NAME: 'tribl_community_staging',
  ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME: 'tribl_community_members_staging',
  ALGOLIA_PASSPORT_LOCATION_INDEX_NAME: 'tribl_passport_location_staging',
  FIREBASE_PROJECT_ID: 'tribl-staging',
  FIREBASE_MEASUREMENT_ID: 'G-TEDF6R5XCB',
  FIREBASE_MESSAGING_SENDER_ID: '971011241618',
  FIREBASE_STORAGE_BUCKET: 'tribl-staging.appspot.com',
  FIREBASE_AUTH_DOMAIN: 'tribl-staging.firebaseapp.com',
  FIREBASE_API_KEY: 'AIzaSyBejHNRT6SCSgNFqWWpqsEyu5FlllXeBT0',
  FIREBASE_APP_ID: '1:971011241618:web:def6dc651e31a54ac4d84b',
  FIREBASE_DATA_BASEURL: 'https://tribl-staging.firebaseio.com'
};

const ENVIRONMENT_VARIABLES = __DEV__ ? DEVELOPMENT_ENV : STAGING_ENV;

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
