import React, { useEffect } from 'react';
import { fromUnixTime } from 'date-fns';
import { addMinutes } from 'date-fns/esm';
import { Image, StyleSheet } from 'react-native';
import jsonwebtoken from 'jwt-decode';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import {
  GenerateFirebaseTokenIT,
  RefreshTokenInterface,
  RegistrationInfo,
  VerifyOTPIT
} from '../../graphql/types';
import { REFRESH_TOKEN } from '../../graphql/server/mutations';
import {
  GET_FIREBASE_TOKEN,
  GET_USER_PASSPORT
} from '../../graphql/server/query';
import { NavigationInterface } from '../types';
import { tagScreenName } from '../../utils/uxcamHelper';
import Storage from '../../libs/storage';
import Notification from '../../libs/notification';
import Firechat from '../../firebase';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

const RUN_TIME_INTERVAL = 10 * 60 * 1000;

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;
  const [getUserPassport] = useLazyQuery(GET_USER_PASSPORT);
  const [refreshToken] = useMutation<RefreshTokenInterface>(REFRESH_TOKEN);
  const [authenticateFirebase, { data: firebase }] = useLazyQuery<
    GenerateFirebaseTokenIT
  >(GET_FIREBASE_TOKEN);

  useEffect(() => {
    tagScreenName('SplashScreen');
    if (firebase?.generateFirebaseToken) {
      Storage.setUserCredentials(firebase?.generateFirebaseToken);
      Firechat.signIn(firebase?.generateFirebaseToken.firebase_token);
    }

    setImmediate(() => {
      setInterval(async () => {
        const storageData = await Storage.getUserCredentials();

        if (!storageData) return;

        const credentials = JSON.parse(storageData) as VerifyOTPIT;
        const payload: null | { [key: string]: any } | any = jsonwebtoken(
          credentials.id_token
        );

        const tokenExpiryTime = fromUnixTime(payload?.exp);
        const tokenExpiryMinute = addMinutes(new Date(), 30);
        const expiryHour =
          tokenExpiryTime.getTime() <= tokenExpiryMinute.getTime();

        if (expiryHour) {
          const { data } = await refreshToken({
            variables: { payload: { refreshToken: credentials.refresh_token } }
          });

          await Storage.setUserCredentials(data?.refreshToken);
        }
      }, RUN_TIME_INTERVAL);
    });
  }, [firebase]);

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
      const userCredStorageData = await Storage.getUserCredentials();
      const userRegStorageData = await Storage.getUserRegistration();

      if (!userCredStorageData || !userRegStorageData) {
        return navigation.replace('SignupScreen');
      }

      const credentials = JSON.parse(userCredStorageData) as VerifyOTPIT;
      const userRegistration = JSON.parse(
        userRegStorageData
      ) as RegistrationInfo;

      if (!userRegistration.completed) {
        return navigation.replace('SignupScreen', {
          screen: userRegistration.route
        });
      }

      const payload: null | { [key: string]: any } | any = jsonwebtoken(
        credentials.id_token
      );

      const tokenExpiryTime = fromUnixTime(payload?.exp);
      const tokenExpiryMinute = addMinutes(new Date(), 30);
      const expiryHour =
        tokenExpiryTime.getTime() <= tokenExpiryMinute.getTime();

      if (expiryHour) {
        const { data } = await refreshToken({
          variables: { payload: { refreshToken: credentials.refresh_token } }
        });

        await Storage.setUserCredentials(data?.refreshToken);
      } else authenticateFirebase();

      setImmediate(() => navigation.replace(userRegistration.route));
    } catch (error) {
      return navigation.replace('SignupScreen');
    }
  };

  return (
    <Notification>
      <Container>
        <Image
          source={require('../../../assets/images/splash.png')}
          style={[
            StyleSheet.absoluteFill,
            { width: undefined, height: undefined, resizeMode: 'contain' }
          ]}
        />
      </Container>
    </Notification>
  );
}
