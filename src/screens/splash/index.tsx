import React, { useEffect } from 'react';
import { fromUnixTime } from 'date-fns';
import { addMinutes } from 'date-fns/esm';
import { Image, StyleSheet } from 'react-native';
import jsonwebtoken from 'jwt-decode';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import {
  GenerateFirebaseTokenIT,
  NotificationMessage,
  RefreshTokenInterface,
  RegistrationInfo,
  VerifyOTPIT
} from '../../graphql/types';
import {
  REFRESH_TOKEN,
  UPDATE_NOTIFICATION
} from '../../graphql/server/mutations';
import { GET_USER_PASSPORT } from '../../graphql/server/query';
import { GET_FIREBASE_TOKEN } from '../../graphql/server/mutations';
import { NavigationInterface } from '../types';
import { tagScreenName } from '../../utils/uxcamHelper';
import Storage from '../../libs/storage';
import Firechat from '../../firebase';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  CHANGE_MESSAGE_NOTIFICATION_BADGE
} from '../../graphql/cache/mutations';

const RUN_TIME_INTERVAL = 10 * 60 * 1000;

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: {} };
}

const messaging = fcmMessaging();

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;

  const [getUserPassport] = useLazyQuery(GET_USER_PASSPORT);
  const [refreshToken] = useMutation<RefreshTokenInterface>(REFRESH_TOKEN);
  const [authenticateFirebase, { data: firebase }] = useMutation<
    GenerateFirebaseTokenIT
  >(GET_FIREBASE_TOKEN);

  const [updatePassportFCM] = useMutation(UPDATE_NOTIFICATION);
  const [changeMessageNotification] = useMutation(
    CHANGE_MESSAGE_NOTIFICATION_BADGE
  );

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

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
      const userRegistration: RegistrationInfo = JSON.parse(userRegStorageData);

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

      setImmediate(async () => {
        const remoteMessage: FirebaseMessagingTypes.RemoteMessage | null = await messaging.getInitialNotification();
        const data = (remoteMessage?.data as unknown) as NotificationMessage;

        if (!remoteMessage) {
          return navigation.replace(userRegistration.route);
        }

        if (data.type === 'MESSAGE_RECEIVED') {
          changeMessageNotification({
            variables: { showMessageNotificationBadge: true }
          });
        }

        if (data.type === 'CONNECTION_REQUEST_RECEIVED') {
          changeConnectionNotification({
            variables: { showConnectionNotificationBadge: true }
          });

          return navigation.replace('DrawerScreen', {
            screen: 'ConnectionRequest'
          });
        }

        navigation.replace(userRegistration.route);
      });
    } catch (error) {
      return navigation.replace('SignupScreen');
    }
  };

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
    authenticateFirebase();
    getUserPassport();
  }, []);

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
