import React, { useEffect } from 'react';
import { addHours, isSameMinute, subMinutes } from 'date-fns';
import { Image, StyleSheet } from 'react-native';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { RefreshTokenInterface } from '../../graphql/types';
import { REFRESH_TOKEN } from '../../graphql/server/mutations';
import { GET_USER_PASSPORT } from '../../graphql/server/query';
import { NavigationInterface } from '../types';
import Storage from '../../libs/storage';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;
  const [getUserPassport] = useLazyQuery(GET_USER_PASSPORT);
  const [refreshToken] = useMutation<RefreshTokenInterface>(REFRESH_TOKEN);

  useEffect(() => {
    handleAuthentication();
    getUserPassport();
  }, []);

  const handleAuthentication = async () => {
    try {
      const value = await Storage.checkInitialLaunch();

      if (!value) {
        return navigation.replace('WalkThroughScreen');
      }

      const credentials = await Storage.getUserCredentials();
      const userRegistration = await Storage.getUserRegistration();

      if (!userRegistration.completed) {
        return navigation.replace('SignupScreen', {
          screen: userRegistration.route
        });
      }

      const tokenExpiresIn = addHours(
        new Date(),
        credentials.expires_in / 3600
      );

      const tokenExpiryMinute = subMinutes(new Date(), 10);
      const expiredToken = isSameMinute(tokenExpiresIn, tokenExpiryMinute);

      if (expiredToken) {
        const { data } = await refreshToken({
          variables: { payload: { refreshToken: credentials.refresh_token } }
        });

        await Storage.setUserCredentials(data?.refreshToken);
      }

      navigation.replace(userRegistration.route);
    } catch (error) {
      return navigation.replace('SignupScreen');
    }
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
