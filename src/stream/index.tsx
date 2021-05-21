import React, {
  useState,
  useEffect,
  useContext,
  FunctionComponent
} from 'react';
import Intercom from 'react-native-intercom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  GET_ALL_CHANNEL_CREATION_REQUEST,
  GET_COMMUNITY_CREATION_REQUEST,
  GET_CONNECTION_REQUEST,
  GET_TRIBE_INVITES,
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
  ConnectionRequestsInterface,
  CommunityInviteInterface,
  CommunityCreationRequestInterface,
  AllChannelCreationRequestInterface
} from '../graphql/types';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  CHANGE_MESSAGE_NOTIFICATION_BADGE,
  CHANGE_TRIBE_REQUEST_NOTIFICATION_BADGE
} from '../graphql/cache/mutations';
import fcmMessaging, {
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import {
  ConnectionOpen,
  LiteralStringForUnion,
  UserResponse
} from 'stream-chat';
import Storage from '../libs/storage';
import { decodeToken } from '../utils/decodeToken';
import { PAGINATION_DEFAULT } from '../constants';
import { DEVICE_OS } from '../utils/device';

import {
  ThreadType,
  chatClient,
  ChannelType,
  StreamContext,
  LocalUserType,
  ActivityScreenType,
  LocalChannelType
} from './types';

const messaging = fcmMessaging();

const StreamProvider: FunctionComponent = ({ children }) => {
  const [channel, setChannel] = useState<ChannelType>({} as ChannelType);
  const [thread, setThread] = useState<ThreadType>({} as ThreadType);
  const [activityScreen, setActivityScreen] = useState<ActivityScreenType>(
    'channelScreen'
  );

  const [updatePassportFCM] = useMutation(UPDATE_USER_PASSPORT);
  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
  const { data: connectionRequestData } = useQuery<ConnectionRequestsInterface>(
    GET_CONNECTION_REQUEST
  );

  const { data: inviteData } = useQuery<CommunityInviteInterface>(
    GET_TRIBE_INVITES,
    { variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } } }
  );

  const { data: requestData } = useQuery<CommunityCreationRequestInterface>(
    GET_COMMUNITY_CREATION_REQUEST,
    { variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } } }
  );

  const { data: channelRequestData } = useQuery<
    AllChannelCreationRequestInterface
  >(GET_ALL_CHANNEL_CREATION_REQUEST, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
  });

  // Request Push Notification permission from device.
  const requestPermission = async () => {
    const authStatus = await messaging.requestPermission();
    const enabled =
      authStatus === fcmMessaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === fcmMessaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      crashlytics.log(`NOTIFICATION AUTHORIZATION STATUS, ${authStatus}`);
    }
  };

  const tribeInvites = inviteData?.communityInvites;
  const tribeRequest = requestData?.communityCreationRequests;
  const connectionRequests = connectionRequestData?.connectionRequests;
  const channelRequest = channelRequestData?.myChannelCreationRequests;

  const [changeMessageNotification] = useMutation(
    CHANGE_MESSAGE_NOTIFICATION_BADGE
  );

  const [changeTribeRequestNotification] = useMutation(
    CHANGE_TRIBE_REQUEST_NOTIFICATION_BADGE
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

    if (data?.type === IFCMMessageTypes.CONNECTION_REQUEST_RECEIVED) {
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

  useEffect(() => {
    let unsubscribe: () => void;

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
        const userCredStorage = await Storage.getUserCredentials();
        const credentials = JSON.parse(userCredStorage || '{}') as VerifyOTPIT;
        let streams_token = credentials?.streams_token;
        let decodedToken: { [key: string]: any } | null = null;

        if (streams_token) {
          decodedToken = decodeToken(streams_token);
        }

        // add check for token expiry here in future.
        if (!streams_token || decodedToken?.user_id !== user.id) {
          const { data } = await authenticateStream();
          streams_token = `${data?.generateStreamsToken.streams_token}`;
          Storage.setUserCredentials(data?.generateStreamsToken);
        }

        await requestPermission();
        const streamUser = await chatClient.connectUser(user, streams_token);
        unsubscribe = await registerPushToken(credentials);
        subscribeToStreams(streamUser);
        onSignIn(passport);
      } catch (error) {
        crashlytics.recordError(new Error(error));
        crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
      }
    };

    if (userData?.myPassport.id && !chatClient.user?.id) {
      initChat(userData?.myPassport);
    }

    return () => {
      chatClient?.disconnect().then(unsubscribe);
    };
  }, [userData?.myPassport.id]);

  // Register FCM token with stream chat server.
  const registerPushToken = async (credentials: VerifyOTPIT) => {
    const token = await messaging.getToken();
    if (credentials?.id_token) {
      updatePassportFCM({ variables: { payload: { fcm: token } } });
    }
    if (DEVICE_OS === 'android') {
      Intercom.sendTokenToIntercom(token);
    }
    await chatClient.addDevice(token, 'firebase');
    return messaging.onTokenRefresh(
      async (newToken) => await chatClient.addDevice(newToken, 'firebase')
    );
  };

  const subscribeToStreams = async (
    streamUser: ConnectionOpen<
      LocalChannelType,
      LiteralStringForUnion,
      LocalUserType
    > | void
  ) => {
    if (!streamUser) return;

    const { devices } = await chatClient.getDevices();

    devices?.forEach((device) => {
      if (device.disabled) {
        chatClient.removeDevice(`${device?.id}`);
      }
    });

    if (streamUser && streamUser.me?.total_unread_count) {
      changeMessageNotification({
        variables: { showMessageNotificationBadge: true }
      });
    } else {
      changeMessageNotification({
        variables: { showMessageNotificationBadge: false }
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
  };

  useEffect(() => {
    connectionRequests?.data.length
      ? changeConnectionNotification({
          variables: { showConnectionNotificationBadge: true }
        })
      : changeConnectionNotification({
          variables: { showConnectionNotificationBadge: false }
        });

    if (
      tribeInvites?.data.length ||
      tribeRequest?.data.length ||
      channelRequest?.data.length
    ) {
      changeTribeRequestNotification({
        variables: { showTribeRequestNotificationBadge: true }
      });
    } else {
      changeTribeRequestNotification({
        variables: { showTribeRequestNotificationBadge: false }
      });
    }
  }, [
    tribeInvites?.data.length,
    tribeRequest?.data.length,
    channelRequest?.data.length,
    connectionRequests?.data.length
  ]);

  useEffect(() => {
    // Register foreground handler
    const unsubscribe = messaging.onMessage(presentNotification);
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
