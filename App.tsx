import React, { useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import './src/internationalization';
//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import AppRouter from './src';
import './src/config';
import ENVIRONMENT_VARIABLES from './src/config';

enableScreens();

RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
RNUxcam.startWithKey(ENVIRONMENT_VARIABLES.UX_CAM);

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
