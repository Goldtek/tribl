import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import * as Sentry from '@sentry/react-native';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { UPDATE_NOTIFICATION } from '../../graphql/server/mutations';
import AsyncStorage from '@react-native-community/async-storage';
import { USER_FCM_TOKEN } from '../../constants';
import {
  CHANGE_MESSAGE_NOTIFICATION_BADGE,
  CHANGE_CONNECTION_NOTIFICATION_BADGE
} from '../../graphql/cache/mutations';
import { NotificationMessage } from '../../graphql/types';

type GlobalNotificationProps = {
  children: JSX.Element;
};

const messaging = fcmMessaging();

export default function GlobalNotification(props: GlobalNotificationProps) {
  const [updatePassportFCM] = useMutation(UPDATE_NOTIFICATION);
  const [changeMessageNotification] = useMutation(
    CHANGE_MESSAGE_NOTIFICATION_BADGE
  );

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  useEffect(() => {
    checkPermission();

    // Register foreground handler
    const unsubscribe = messaging.onMessage(presentNotification);

    // Register background handler
    messaging.setBackgroundMessageHandler(presentNotification);

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging.onNotificationOpenedApp(presentNotification);

    // Check whether an initial notification is available
    messaging.getInitialNotification().then(presentNotification);

    return unsubscribe;
  }, []);

  const presentNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null
  ) => {
    const data = (remoteMessage?.data as unknown) as NotificationMessage;

    if (data.type === 'MESSAGE_RECEIVED') {
      changeMessageNotification({
        variables: { showMessageNotificationBadge: true }
      });
    }

    if (data.type === 'CONNECTION_REQUEST_RECEIVED') {
      changeConnectionNotification({
        variables: { showConnectionNotificationBadge: true }
      });
    }
  };

  const checkPermission = async () => {
    const hasPermission = await messaging.hasPermission();
    hasPermission ? getToken() : requestPermission();
  };

  const getToken = async () => {
    try {
      let token = await AsyncStorage.getItem(USER_FCM_TOKEN);

      if (!token) {
        token = await messaging.getToken();
        await AsyncStorage.setItem(USER_FCM_TOKEN, token);
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
