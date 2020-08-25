//@ts-nocheck
const { TRIBL_SERVER_BASE_URI, GOOGLE_PLACES_API } = 'react-native-dotenv';
import Reactotron from 'reactotron-react-native';

// FIX THIS TO USE ENVIRONMENT VARIABLES (APP SECRETES)
const ENVIRONMENT_VARIABLES = {
  TRIBL_SERVER_BASE_URI:
    TRIBL_SERVER_BASE_URI || 'https://tribl-core-development.herokuapp.com/',
  GOOGLE_PLACES_API:
    GOOGLE_PLACES_API || 'AIzaSyAJR6mSnhyzyvUAsAOQTpAjoZrNayWe880',
  CLOUDINARY_NAME: 'codeunite',
  CLOUDINARY_PRESET: 'htrghwec'
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
