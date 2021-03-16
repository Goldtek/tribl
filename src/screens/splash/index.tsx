import React, { useEffect } from 'react';
import { fromUnixTime } from 'date-fns';
import { addMinutes } from 'date-fns/esm';
import { Image, StyleSheet } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import jsonwebtoken from 'jwt-decode';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import {
  GenerateFirebaseTokenIT,
  NotificationMessage,
  RefreshTokenInterface,
  RegistrationInfo,
  VerifyOTPIT
} from '../../graphql/types';
import { REFRESH_TOKEN, UPDATE_PASSPORT } from '../../graphql/server/mutations';
import {
  GET_USER_PASSPORT,
  GET_FIREBASE_TOKEN
} from '../../graphql/server/query';
import { tagScreenName } from '../../utils/uxcamHelper';
import { crashlytics } from '../../firebase/config';
import { APP_VERSION } from '../../utils/device';
import { NavigationInterface } from '../types';
import Storage from '../../libs/storage';
import Firechat from '../../firebase';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  CHANGE_MESSAGE_NOTIFICATION_BADGE
} from '../../graphql/cache/mutations';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

const RUN_TIME_INTERVAL = 10 * 60 * 1000;

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

// const messaging = fcmMessaging();

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;

  const [getUserPassport] = useLazyQuery(GET_USER_PASSPORT);
  const [refreshToken] = useMutation<RefreshTokenInterface>(REFRESH_TOKEN);
  const [authenticateFirebase, { data: firebase }] = useLazyQuery<
    GenerateFirebaseTokenIT
  >(GET_FIREBASE_TOKEN);

  const [updatePassportFCM] = useMutation(UPDATE_PASSPORT);

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

      if (!credentials.appVersion || credentials.appVersion !== APP_VERSION) {
        return navigation.replace('SignupScreen');
      }

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
        // Must be outside of any component LifeCycle (such as `componentDidMount`).
        PushNotification.configure({
          // (optional) Called when Token is generated (iOS and Android)
          onRegister: async ({ token }) => {
            updatePassportFCM({ variables: { payload: { fcm: token } } });
          },

          // (required) Called when a remote is received or opened, or local notification is opened
          onNotification: (notification) => {
            const data = notification.data as NotificationMessage;

            if (!data) {
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

            // (required) Called when a remote is received or opened, or local notification is opened
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          },

          // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
          onRegistrationError: (error) => {
            return crashlytics.recordError(new Error(error));
          },

          // IOS ONLY (optional): default: all - Permissions to register.
          permissions: { alert: true, badge: true, sound: true },

          requestPermissions: true
        });

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
