import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import * as Sentry from '@sentry/react-native';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { UPDATE_NOTIFICATION } from '../../graphql/server/mutations';
import AsyncStorage from '@react-native-community/async-storage';

type GlobalNotificationProps = {
  children: JSX.Element;
};

const messaging = fcmMessaging();

export default function GlobalNotification(props: GlobalNotificationProps) {
  const [updatePassportFCM] = useMutation(UPDATE_NOTIFICATION);

  useEffect(() => {
    checkPermission();

    // Register foreground handler
    const unsubscribe = messaging.onMessage(presentNotification);

    // Register background handler
    messaging.setBackgroundMessageHandler(presentNotification);

    return unsubscribe;
  }, []);

  const presentNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    console.log(remoteMessage);

    PushNotification.presentLocalNotification({
      title: 'Local Notification',
      message: 'This is a local notification example'
    });
  };

  const checkPermission = async () => {
    const hasPermission = await messaging.hasPermission();
    hasPermission ? getToken() : requestPermission();
  };

  const getToken = async () => {
    try {
      let token = await AsyncStorage.getItem('token');

      if (!token) {
        token = await messaging.getToken();
        await AsyncStorage.setItem('token', token);
      }

      updatePassportFCM({ variables: { payload: { token } } });
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const requestPermission = async () => {
    try {
      const authStatus = await messaging.requestPermission();
      const enabled =
        authStatus === fcmMessaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === fcmMessaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) getToken();
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return props.children;
}
