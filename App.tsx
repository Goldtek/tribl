import React, { useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import './src/internationalization';
//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import AppRouter from './src';
import ENVIRONMENT_VARIABLES from './src/config';

enableScreens();

RNUxcam.optIntoSchematicRecordings();
RNUxcam.startWithKey(ENVIRONMENT_VARIABLES.TRIBL_UX_CAM);
RNUxcam.setAutomaticScreenNameTagging(false);

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    loadApp();
  }, []);

  const loadApp = async () => {
    await loadResources();
    setIsAppReady(true);
  };

  return isAppReady ? <AppRouter /> : null;
}
