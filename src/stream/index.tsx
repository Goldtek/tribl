import React, {
  useState,
  useEffect,
  useContext,
  FunctionComponent
} from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { GET_USER_PASSPORT } from '../graphql/server/query';
import {
  UPDATE_USER_PASSPORT,
  GENERATE_STREAMS_TOKEN
} from '../graphql/server/mutations';
import { crashlytics } from '../firebase/config';
import {
  MyPassportInterface,
  NotificationMessage,
  GenerateStreamsTokenRequestInterface
} from '../graphql/types';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  CHANGE_MESSAGE_NOTIFICATION_BADGE
} from '../graphql/cache/mutations';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';

import {
  ThreadType,
  chatClient,
  ChannelType,
  StreamContext,
  ActivityScreenType
} from './types';

const messaging = fcmMessaging();

const StreamProvider: FunctionComponent = ({ children }) => {
  const [channel, setChannel] = useState<ChannelType>({} as ChannelType);
  const [thread, setThread] = useState<ThreadType>({} as ThreadType);
  const [activityScreen, setActivityScreen] = useState<ActivityScreenType>(
    'channelScreen'
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
  const [updatePassportFCM] = useMutation(UPDATE_USER_PASSPORT);
  const [changeMessageNotification] = useMutation(
    CHANGE_MESSAGE_NOTIFICATION_BADGE
  );

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  useEffect(() => {
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

    if (data.type === 'CONNECTION_REQUEST_RECEIVED') {
      changeConnectionNotification({
        variables: { showConnectionNotificationBadge: true }
      });
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
          await chatClient.disconnect();
          const streamUser = await chatClient.connectUser(
            //@ts-ignore
            user,
            //@ts-ignore
            async () => {
              const { data } = await authenticateStream();
              return data?.generateStreamsToken.streams_token;
            }
          );

          setChannel(chatClient.channel('team', 'default_channel'));

          if (streamUser && streamUser.me?.total_unread_count) {
            changeMessageNotification({
              variables: { showMessageNotificationBadge: true }
            });
          }

          chatClient.on((event) => {
            if (
              event.total_unread_count !== undefined &&
              event.total_unread_count >= 1
            ) {
              changeMessageNotification({
                variables: { showMessageNotificationBadge: true }
              });
            } else if (
              event.total_unread_count !== undefined &&
              event.total_unread_count === 0
            ) {
              changeMessageNotification({
                variables: { showMessageNotificationBadge: false }
              });
            }
          });

          // Must be outside of any component LifeCycle (such as `componentDidMount`).
          PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: async ({ token, os }) => {
              updatePassportFCM({ variables: { payload: { fcm: token } } });

              const fcmToken = await messaging.getToken();

              await chatClient.addDevice(
                os === 'ios' ? token : fcmToken,
                os === 'ios' ? 'apn' : 'firebase',
                userData?.myPassport.id
              );

              const { devices } = await chatClient.getDevices();

              devices?.forEach((device) => {
                if (device.disabled) {
                  chatClient.removeDevice(`${device?.id}`);
                }
              });
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: (notification) => {
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
        } catch (error) {
          crashlytics.recordError(new Error(error));
        }
      };

      if (!chatClient.user) {
        initChat();
      }
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
