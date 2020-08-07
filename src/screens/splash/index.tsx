import React, { useLayoutEffect } from 'react';
import { NavigationInterface } from '../types';
import Storage from '../../storage';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;

  useLayoutEffect(() => {
    handleAuthentication();
  }, []);

  const handleAuthentication = async () => {
    const initialLaunch = Storage.getInitialLaunch();

    if (!initialLaunch) {
      return navigation.replace('WalkThroughScreen');
    }

    const credentials = Storage.getUserCredentials();

    if (!credentials) {
      return navigation.replace('SignupScreen');
    }

    navigation.replace('CommunityScreen');
  };

  return <Container />;
}
