import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  FunctionComponent
} from 'react';
import Intercom from 'react-native-intercom';
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
  GenerateStreamsTokenRequestInterface,
  PassportInterface,
  IFCMMessageTypes,
  VerifyOTPIT
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
  const [changeMessageNotification] = useMutation(
    CHANGE_MESSAGE_NOTIFICATION_BADGE
  );

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  useEffect(() => {
    // Register foreground handler
    const unsubscribe = messaging.onMessage(presentNotification);

    // Check whether an initial notification is available
    messaging.getInitialNotification().then(presentNotification);

    return unsubscribe;
  }, []);

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

  const initChat = useCallback(async () => {
    if (
      !userData?.myPassport.id &&
      !userData?.myPassport.avatar &&
      !userData?.myPassport.firstName &&
      !userData?.myPassport.lastName
    ) {
      return;
    }

    const user: UserResponse<LocalUserType> = {
      id: `${userData?.myPassport.id}`,
      image: `${userData?.myPassport.avatar}`,
      citizenship: JSON.stringify(userData?.myPassport.citizenship),
      name: `${userData?.myPassport.firstName} ${userData?.myPassport.lastName}`,
      value: `${userData?.myPassport.firstName} ${userData?.myPassport.lastName}`
    };

    try {
      await chatClient.disconnect();
      const streamUser = await chatClient.connectUser(user, async () => {
        const { data } = await authenticateStream();
        return `${data?.generateStreamsToken.streams_token}`;
      });

      onSignIn(userData?.myPassport);

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
          const userCredStorageData = await Storage.getUserCredentials();

          if (userCredStorageData) {
            const credentials = JSON.parse(userCredStorageData) as VerifyOTPIT;

            if (credentials.id_token) {
              updatePassportFCM({
                variables: { payload: { fcm: fcmToken } }
              });
            }
          }

          if (os === 'android') {
            Intercom.sendTokenToIntercom(fcmToken);
          }

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
  }, [userData?.myPassport.id]);

  useEffect(() => {
    if (userData?.myPassport.id) {
      // Initializes Stream's chat client.
      // Documentation: https://getstream.io/chat/docs/init_and_users/?language=js
      if (!chatClient.user?.id) {
        initChat();
      }
    }
  }, [userData?.myPassport.id]);

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
