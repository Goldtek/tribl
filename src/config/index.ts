import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';
//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import axios from 'axios';
import ENVIRONMENT_VARIABLES from 'react-native-config';
import RNMixpanel from 'react-native-mixpanel';
import MixpanelAnalytics from '../libs/mixpanel';
import algolia from 'algoliasearch';
import Storage from '../libs/storage';
import { VerifyOTPIT } from '../graphql/types';

declare global {
  interface Console {
    tron: (...args: any[]) => void;
  }
}

if (__DEV__) {
  const { scriptURL } = NativeModules.SourceCode;
  const scriptHostname = scriptURL.split('://')[1].split(':')[0];

  Reactotron.configure({ host: scriptHostname }) // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .connect(); // let's connect!

  //@ts-ignore
  console.tron = Reactotron.log;
}

export const searchClient = algolia(
  ENVIRONMENT_VARIABLES.TRIBL_ALGOLIA_APP_ID,
  ENVIRONMENT_VARIABLES.TRIBL_ALGOLIA_API_KEY
);

RNUxcam.optIntoSchematicRecordings();
RNUxcam.startWithKey(ENVIRONMENT_VARIABLES.TRIBL_UX_CAM);
RNUxcam.setAutomaticScreenNameTagging(false);

RNMixpanel.sharedInstanceWithToken(ENVIRONMENT_VARIABLES.TRIBL_MIX_PANEL).then(
  () => {
    RNMixpanel.optOutTracking();
    RNMixpanel.optInTracking();
  }
);

// Set config defaults when creating the instance
export const axiosInstance = axios.create({
  baseURL: ENVIRONMENT_VARIABLES.TRIBL_SERVER_BASE_URI
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const storageData = await Storage.getUserCredentials();

    // Do something before request is sent
    let authToken: string | undefined = undefined;

    if (storageData) {
      const credentials = JSON.parse(storageData) as VerifyOTPIT;
      authToken = credentials.id_token;
    }

    return {
      ...config,
      headers: { ...config.headers, authorization: authToken }
    };
  },
  (error) => Promise.reject(error)
);

export const Mixpanel = new MixpanelAnalytics();

export default ENVIRONMENT_VARIABLES;
