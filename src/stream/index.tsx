import React, {
  useState,
  useEffect,
  useContext,
  FunctionComponent
} from 'react';
import Intercom from 'react-native-intercom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {
  GET_CONNECTION_REQUEST,
  GET_USER_PASSPORT
} from '../graphql/server/query';
import {
  UPDATE_USER_PASSPORT,
  GENERATE_STREAMS_TOKEN
} from '../graphql/server/mutations';
import { crashlytics } from '../firebase/config';
import {
  MyPassportInterface,
  NotificationMessage,
  GenerateStreamsTokenRequestInterface,
  PassportInterface,
  IFCMMessageTypes,
  VerifyOTPIT,
  ConnectionRequestsInterface
} from '../graphql/types';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  CHANGE_MESSAGE_NOTIFICATION_BADGE
} from '../graphql/cache/mutations';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { UserResponse } from 'stream-chat';
import Storage from '../libs/storage';
import { PAGINATION_DEFAULT } from '../constants';

import {
  ThreadType,
  chatClient,
  ChannelType,
  StreamContext,
  LocalUserType,
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
  const { data: connectionRequestData } = useQuery<ConnectionRequestsInterface>(
    GET_CONNECTION_REQUEST,
    { variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } } }
  );

  const connectionRequests = connectionRequestData?.connectionRequests;

  const [changeMessageNotification] = useMutation(
    CHANGE_MESSAGE_NOTIFICATION_BADGE
  );

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const presentNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null
  ) => {
    crashlytics.log(
      `PRESENT NOTIFICATION MESSAGE, ${JSON.stringify(remoteMessage)}`
    );

    const data = (remoteMessage?.data as unknown) as NotificationMessage;

    if (data.type === IFCMMessageTypes.CONNECTION_REQUEST_RECEIVED) {
      changeConnectionNotification({
        variables: { showConnectionNotificationBadge: true }
      });
    }
  };

  const [authenticateStream] = useMutation<
    GenerateStreamsTokenRequestInterface
  >(GENERATE_STREAMS_TOKEN);

  const onSignIn = async (user: PassportInterface) => {
    await Promise.all([
      crashlytics.setUserId(user.id),
      crashlytics.setAttributes({
        email: user.email,
        lastName: `${user.lastName}`,
        firstName: `${user.firstName}`,
        verified_user: String(user.verified)
      })
    ]);
    crashlytics.log('USER SINGED IN SUCCESSFULLY.');
  };

  const initChat = async (passport: PassportInterface) => {
    if (
      !passport.id &&
      !passport.avatar &&
      !passport.firstName &&
      !passport.lastName
    ) {
      return;
    }

    const user: UserResponse<LocalUserType> = {
      id: `${passport.id}`,
      image: `${passport.avatar}`,
      citizenship: JSON.stringify(passport.citizenship),
      name: `${passport.firstName} ${passport.lastName}`,
      value: `${passport.firstName} ${passport.lastName}`
    };

    try {
      await chatClient.disconnect();
      const userCredStorage = await Storage.getUserCredentials();
      const credentials = JSON.parse(userCredStorage || '{}') as VerifyOTPIT;
      let streams_token = credentials?.streams_token;

      if (!streams_token) {
        const { data } = await authenticateStream();
        streams_token = `${data?.generateStreamsToken.streams_token}`;
        Storage.setUserCredentials(data?.generateStreamsToken);
      }

      const streamUser = await chatClient.connectUser(user, streams_token);
      onSignIn(passport);

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
          const fcmToken = await messaging.getToken();
          if (credentials.id_token) {
            updatePassportFCM({
              variables: { payload: { fcm: fcmToken } }
            });
          }

          if (os === 'android') {
            Intercom.sendTokenToIntercom(fcmToken);
          }

          await chatClient.addDevice(
            os === 'ios' ? token : fcmToken,
            os === 'ios' ? 'apn' : 'firebase',
            passport.id
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
          crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
          return crashlytics.recordError(new Error(error));
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: { alert: true, badge: true, sound: true },

        requestPermissions: true
      });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  useEffect(() => {
    if (userData?.myPassport.id) {
      // Initializes Stream's chat client.
      // Documentation: https://getstream.io/chat/docs/init_and_users/?language=js
      if (!chatClient.user?.id) {
        initChat(userData?.myPassport);
      }
    }
  }, [userData?.myPassport.id]);

  useEffect(() => {
    connectionRequests?.data.length
      ? changeConnectionNotification({
          variables: { showConnectionNotificationBadge: true }
        })
      : changeConnectionNotification({
          variables: { showConnectionNotificationBadge: false }
        });
  }, [connectionRequests?.data.length]);

  useEffect(() => {
    // Register foreground handler
    const unsubscribe = messaging.onMessage(presentNotification);
    // Check whether an initial notification is available
    messaging.getInitialNotification().then(presentNotification);
    return unsubscribe;
  }, []);

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
