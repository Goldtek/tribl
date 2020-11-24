//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import { RootStackParamScreensList } from '../screens/types';

//hides referenced view if reference exist
export const hideSensitiveView = (ref: any) => {
  if (ref) {
    RNUxcam.occludeSensitiveView(ref);
  }
};

//hides referenced view if reference exist
export const unhideSensitiveView = (ref: any) => {
  if (ref) {
    RNUxcam.unOccludeSensitiveView(ref);
  }
};

//log custom events
export const logEvent = (key: string, name: object) => {
  RNUxcam.logEvent(key, name);
};

//log custom events
export const logEventWithouProps = (key: string, name: string) => {
  RNUxcam.logEvent(key);
};

//tag current screen
export const tagScreenName = (screen: RootStackParamScreensList) => {
  RNUxcam.tagScreenName(screen);
};

//hide sensitive screen
export const occludeSensitiveScreen = (bool: boolean) => {
  RNUxcam.occludeSensitiveScreen(bool);
};

//set user identity
export const addUserIdentity = (id: string) => {
  RNUxcam.setUserIdentity(id);
};

export const setUserPropertyValue = (key: string, val: string) => {
  RNUxcam.setUserProperty(key, val);
};

//allow short breaks when app goes to background
export const allowShowBreak = (boolValue: boolean) => {
  RNUxcam.allowShortBreakForAnotherApp(boolValue);
};
