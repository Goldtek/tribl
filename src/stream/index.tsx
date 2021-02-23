import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { GET_USER_PASSPORT } from '../graphql/server/query';
import {
  GENERATE_STREAMS_TOKEN,
  UPDATE_NOTIFICATION
} from '../graphql/server/mutations';
import {
  GenerateStreamsTokenRequestInterface,
  MyPassportInterface
} from '../graphql/types';
import { crashlytics } from '../firebase/config';

import {
  ThreadType,
  chatClient,
  ChannelType,
  StreamContext,
  ActivityScreenType
} from './types';

const StreamProvider: FunctionComponent = ({ children }) => {
  const [channel, setChannel] = useState<ChannelType>({} as ChannelType);
  const [thread, setThread] = useState<ThreadType>({} as ThreadType);
  const [activityScreen, setActivityScreen] = useState<ActivityScreenType>(
    'channelScreen'
  );

  const [updatePassportFCM] = useMutation(UPDATE_NOTIFICATION);

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

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

          // Must be outside of any component LifeCycle (such as `componentDidMount`).
          PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: async ({ token, os }) => {
              updatePassportFCM({ variables: { payload: { token } } });
              await chatClient.addDevice(
                token,
                os === 'ios' ? 'apn' : 'firebase',
                userData?.myPassport.id
              );
            },

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
