import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { GET_USER_PASSPORT } from '../graphql/server/query';
import {
  GENERATE_STREAMS_TOKEN,
  UPDATE_NOTIFICATION
} from '../graphql/server/mutations';
import {
  GenerateStreamsTokenRequestInterface,
  MyPassportInterface,
  NotificationMessage
} from '../graphql/types';
import { crashlytics } from '../firebase/config';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  CHANGE_MESSAGE_NOTIFICATION_BADGE
} from '../graphql/cache/mutations';
import { DEVICE_OS } from '../utils/device';
import {
  ThreadType,
  chatClient,
  ChannelType,
  StreamContext,
  ActivityScreenType
} from './types';

const messaging = fcmMessaging();

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
  permissions: { alert: true, badge: true, sound: true },

  requestPermissions: true
});

const StreamProvider: FunctionComponent = ({ children }) => {
  const [channel, setChannel] = useState<ChannelType>({} as ChannelType);
  const [thread, setThread] = useState<ThreadType>({} as ThreadType);
  const [activityScreen, setActivityScreen] = useState<ActivityScreenType>(
    'channelScreen'
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
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
      const token = await messaging.getToken();
      updatePassportFCM({ variables: { payload: { token } } });
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

  const [authenticateStream] = useMutation<
    GenerateStreamsTokenRequestInterface
  >(GENERATE_STREAMS_TOKEN);

  useEffect(() => {
    if (userData?.myPassport) {
      const user = {
        id: `${userData?.myPassport.id}`,
        image: `${userData?.myPassport.avatar}`,
        name: `${userData?.myPassport.firstName} ${userData?.myPassport.lastName}`,
        value: `${userData?.myPassport.firstName} ${userData?.myPassport.lastName}`
      };

      // Initializes Stream's chat client.
      // Documentation: https://getstream.io/chat/docs/init_and_users/?language=js
      const initChat = async () => {
        try {
          await chatClient.connectUser(
            //@ts-ignore
            user,
            //@ts-ignore
            async () => {
              const { data } = await authenticateStream();
              return data?.generateStreamsToken.streams_token;
            }
          );

          const token = await messaging.getToken();

          await chatClient.addDevice(
            token,
            DEVICE_OS === 'ios' ? 'apn' : 'firebase'
          );
        } catch (error) {
          crashlytics.recordError(Error(error.message));
        }
      };

      initChat();
    }
  }, [userData?.myPassport]);

  return (
    <StreamContext.Provider
      value={{
        thread,
        channel,
        setThread,
        setChannel,
        activityScreen,
        setActivityScreen
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStreamContext = () => useContext(StreamContext);

export default StreamProvider;
