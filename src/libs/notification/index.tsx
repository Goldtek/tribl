import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import * as Sentry from '@sentry/react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { UPDATE_NOTIFICATION } from '../../graphql/server/mutations';
import {
  CHANGE_MESSAGE_NOTIFICATION_BADGE,
  CHANGE_CONNECTION_NOTIFICATION_BADGE
} from '../../graphql/cache/mutations';
import { NotificationMessage } from '../../graphql/types';
import { useNavigation } from '@react-navigation/native';

type GlobalNotificationProps = {
  children: JSX.Element;
};

const messaging = fcmMessaging();

export default function GlobalNotification(props: GlobalNotificationProps) {
  const { navigate } = useNavigation();

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
    messaging.onNotificationOpenedApp(navigateNotification);

    // Check whether an initial notification is available
    messaging.getInitialNotification().then(presentNotification);

    // navigate('InboxScreen');

    // NAVIGATE USER TO DIRECT MESSAGE SCREEN ON DM NOTIFICATION CLICK

    // navigate('DirectChatScreen', {
    //   title: 'Amakiri Joseph',
    //   chatId:
    //     '08edd453-891d-4852-83ec-b3c604c5ce9f|e52b0b1c-42e8-4515-9280-4ce4aa598c86',
    //   receiverId: 'f1526d08-571c-4eda-bb41-0810407fdec2',
    //   avatar:
    //     'https://drive.google.com/uc?view=&id=14SY6cRWX2ojTeynq1d_E9O1aIA-2l5Jp',
    //   firstName: 'Amakiri',
    //   lastName: 'Joseph',
    //   id: '08edd453-891d-4852-83ec-b3c604c5ce9f',
    //   phoneNumber: '+2348132978120'
    // });

    // // NAVIGATE USER TO MESSAGE REQUEST CHAT SCREEN ON MESSAGE REQUEST NOTIFICATION CLICK

    // navigate('MessageRequestChatScreen', {
    //   title: 'Amakiri Joseph',
    //   chatId:
    //     '08edd453-891d-4852-83ec-b3c604c5ce9f|e52b0b1c-42e8-4515-9280-4ce4aa598c86',
    //   senderId: 'f1526d08-571c-4eda-bb41-0810407fdec2',
    //   avatar:
    //     'https://drive.google.com/uc?view=&id=14SY6cRWX2ojTeynq1d_E9O1aIA-2l5Jp',
    //   firstName: 'Amakiri',
    //   lastName: 'Joseph',
    //   id: '08edd453-891d-4852-83ec-b3c604c5ce9f',
    //   communityCount: 4,
    //   connectionCount: 9,
    //   phoneNumber: '+2348132978120'
    // });

    // // NAVIGATE USER TO CHANNEL MESSAGE SCREEN ON CHANNEL MESSAGE NOTIFICATION CLICK

    // navigate('ChannelChatScreen', {
    //   title: 'barter',
    //   chatId: '228bede4-9805-4c06-92f2-52cf86aeff38'
    // });

    return unsubscribe;
  }, []);

  const navigateNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null
  ) => {
    const data = (remoteMessage?.data as unknown) as NotificationMessage;
  };

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
    onRegistrationError: (error) => Sentry.captureException(error),

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: { alert: true, badge: false, sound: true },

    requestPermissions: true
  });

  return props.children;
}
