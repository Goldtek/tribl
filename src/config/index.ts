import Reactotron from 'reactotron-react-native';
//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import ENVIRONMENT_VARIABLES from 'react-native-config';
import RNMixpanel from 'react-native-mixpanel';
import MixpanelAnalytics from '../libs/mixpanel';

declare global {
  interface Console {
    tron: (...args: any[]) => void;
  }
}

if (__DEV__) {
  Reactotron.configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .connect(); // let's connect!

  //@ts-ignore
  console.tron = Reactotron.log;
}

RNUxcam.optIntoSchematicRecordings();
RNUxcam.startWithKey(ENVIRONMENT_VARIABLES.TRIBL_UX_CAM);
RNUxcam.setAutomaticScreenNameTagging(false);

RNMixpanel.sharedInstanceWithToken(ENVIRONMENT_VARIABLES.TRIBL_MIX_PANEL).then(
  () => {
    RNMixpanel.optOutTracking();
    RNMixpanel.optInTracking();
  }
);

export const Mixpanel = new MixpanelAnalytics();

export default ENVIRONMENT_VARIABLES;
