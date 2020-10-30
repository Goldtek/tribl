import React, { useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import './src/internationalization';
//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import AppRouter from './src';
import './src/config';
import ENVIRONMENT_VARIABLES from './src/config';
import { tagScreenName } from './src/utils/uxcamHelper';

enableScreens();

RNUxcam.optIntoSchematicRecordings();
RNUxcam.startWithKey(ENVIRONMENT_VARIABLES.UX_CAM);
RNUxcam.setAutomaticScreenNameTagging(false);

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    loadApp();
    tagScreenName('SplashScreen');
  }, []);

  const loadApp = async () => {
    await loadResources();
    setIsAppReady(true);
  };

  return isAppReady ? <AppRouter /> : null;
}
