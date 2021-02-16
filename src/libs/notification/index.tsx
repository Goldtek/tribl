import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { UPDATE_PASSPORT } from '../../graphql/server/mutations';
import {
  CHANGE_MESSAGE_NOTIFICATION_BADGE,
  CHANGE_CONNECTION_NOTIFICATION_BADGE
} from '../../graphql/cache/mutations';
import { NotificationMessage } from '../../graphql/types';
import { crashlytics } from '../../firebase/config';

type GlobalNotificationProps = {
  children: JSX.Element;
};

const messaging = fcmMessaging();

export default function Notification(props: GlobalNotificationProps) {
  const [updatePassport] = useMutation(UPDATE_PASSPORT);
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

  // const navigateNotification = (
  //   remoteMessage: FirebaseMessagingTypes.RemoteMessage | null
  // ) => {
  //   const { meta } = (remoteMessage?.data as unknown) as NotificationMessage;
  //   const { route, data } = JSON.parse(meta) as NotificationMetaData;

  //   // NAVIGATE USER TO DIRECT MESSAGE SCREEN ON DM NOTIFICATION CLICK

  //   // navigation.replace('CommunityScreen', {
  //   //   screen: 'CommunityScreen',
  //   //   params: { screen: 'CommunityScreen', params: { screen: 'InboxScreen' } }
  //   // });
  // };

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
      const token = await messaging.getToken();
      updatePassport({ variables: { payload: { fcm: token } } });
    } catch (error) {
      crashlytics.recordError(error);
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
      crashlytics.recordError(error);
    }
  };

  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: () => {},

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: (notification) => {
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: (error) => crashlytics.recordError(error),

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: { alert: true, badge: false, sound: true },

    requestPermissions: true
  });

  return props.children;
}
