import React, { useEffect } from 'react';
import { NavigationInterface } from '../types';
import Storage from '../../storage';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;

  useEffect(() => {
    (async () => {
      const initialLaunch = await Storage.checkInitialLaunch();
      if (initialLaunch) {
        return navigation.replace('WalkThroughScreen');
      }

      navigation.replace('SignupScreen');
    })();
  }, []);

  return <Container />;
}
