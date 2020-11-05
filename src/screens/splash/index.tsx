import React, { useEffect } from 'react';
import { fromUnixTime, differenceInHours, addHours } from 'date-fns';
import { Image, StyleSheet } from 'react-native';
import jsonwebtoken from 'jwt-decode';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { RefreshTokenInterface } from '../../graphql/types';
import { REFRESH_TOKEN } from '../../graphql/server/mutations';
import { GET_USER_PASSPORT } from '../../graphql/server/query';
import { NavigationInterface } from '../types';
import Storage from '../../libs/storage';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import { tagScreenName } from '../../utils/uxcamHelper';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;
  const [getUserPassport] = useLazyQuery(GET_USER_PASSPORT);
  const [refreshToken] = useMutation<RefreshTokenInterface>(REFRESH_TOKEN);

  useEffect(() => {
    tagScreenName('SplashScreen');
  }, []);

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

      const payload: null | { [key: string]: any } | any = jsonwebtoken(
        credentials.id_token
      );

      const tokenExpiryTime = fromUnixTime(payload?.exp);
      const tokenExpiryHour = addHours(new Date(), 3);
      const expiryHour = differenceInHours(tokenExpiryTime, tokenExpiryHour);

      if (expiryHour <= 3) {
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
