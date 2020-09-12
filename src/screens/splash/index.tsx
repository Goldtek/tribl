import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { RefreshTokenInterface } from '../../graphql/types';
import { REFRESH_TOKEN } from '../../graphql/server/mutations';
import { NavigationInterface } from '../types';
import Storage from '../../storage';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;

  const credentials = Storage.getUserCredentials();
  useEffect(() => {
    handleAuthentication();
  }, []);

  const [refreshToken] = useMutation<RefreshTokenInterface>(REFRESH_TOKEN, {
    variables: { payload: { refreshToken: credentials?.refresh_token } }
  });

  const refreshUserToken = async () => {
    const { data } = await refreshToken();

    if (data?.refreshToken) {
      Storage.setUserCredentials(data?.refreshToken);
    }
  };

  const handleAuthentication = async () => {
    await Storage.checkInitialLaunch();

    const initialLaunch = Storage.getInitialLaunch();

    if (!initialLaunch) {
      return navigation.replace('WalkThroughScreen');
    }

    if (!credentials) {
      return navigation.replace('SignupScreen');
    }

    await refreshUserToken();

    navigation.replace('CommunityScreen');
  };

  return (
    <Container>
      <Image
        source={require('../../../assets/images/splash.png')}
        style={[
          StyleSheet.absoluteFill,
          { width: undefined, height: undefined, resizeMode: 'contain' }
        ]}
      />
    </Container>
  );
}
