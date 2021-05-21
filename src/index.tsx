import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerStackNavigator from './navigator/sideNavigator';
import PreviewNavigator from './navigator/previewNavigator';
import TriblPayNavigator from './navigator/triblPayNavigator';
import SignupNavigator from './navigator/signupNavigator';
import { navigationRef } from './constants';
import { useThemeContext } from './theme';
import Screens from './screens';
import BottomNavigator from './navigator/bottomNavigator';
import CustomDrawer from './navigator/sideNavigator/customDrawer';
import AccountNavigator from './navigator/accountNavigator';
import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { LinkingOptions } from '@react-navigation/native';
import { NotificationMessage, IFCMMessageTypes } from './graphql/types';
import { crashlytics } from './firebase/config';
import { useMutation } from '@apollo/react-hooks';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  CHANGE_TRIBE_REQUEST_NOTIFICATION_BADGE
} from './graphql/cache/mutations';

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const { fonts, colors } = useThemeContext();

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const [changeTribeRequestNotification] = useMutation(
    CHANGE_TRIBE_REQUEST_NOTIFICATION_BADGE
  );

  // Deep links
  const deepLinksConfig = {
    screens: {
      initialRouteName: 'CommunityScreen',
      SplashScreen: 'splash_screen',
      WalkThroughScreen: 'walk_through_screen',
      SignupScreen: {
        initialRouteName: 'SignupScreen',
        screens: {
          OTPScreen: 'otp_screen',
          SignupScreen: 'signup_screen',
          UserLocationScreen: 'user_location_screen',
          AvatarUploadScreen: 'avatar_upload_screen',
          IdentifyUserScreen: 'identify_user_screen',
          CreateAccountScreen: 'create_account_screen',
          SignupPassportScreen: 'signup_passport_screen'
        }
      },
      DrawerScreen: {
        screens: {
          AddAdminScreen: 'add_admin_screen',
          MyConnections: 'my_connections_screen',
          ThreadChatScreen: 'thread_chat_screen',
          NewMessageScreen: 'new_message_screen',
          DirectChatScreen: 'direct_chats_screen',
          CreateTribeScreen: 'create_tribe_screen',
          ChannelChatScreen: 'channel_chat_screen',
          TribeDetailScreen: 'tribe_detail_screen',
          TribeRequestScreen: 'tribe_request_screen',
          MyNotifications: 'my_notifications_screen',
          MemberDetailScreen: 'member_detail_screen',
          CommunityListScreen: 'community_list_screen',
          InviteToTribeScreen: 'invite_to_tribe_screen',
          ConnectionChatScreen: 'connection_chat_screen',
          ConnectionRequest: 'connection_request_screen',
          ChannelMembersScreen: 'channel_members_screen',
          MessageRequestScreen: 'message_request_screen',
          CommunityDetailScreen: 'community_detail_screen',
          CommunityAlgoliaScreen: 'community_algolia_screen',
          MessageRequestChatScreen: 'message_request_chat_screen',
          UserConnectionListScreen: 'user_connection_list_screen',
          DeepLinkDirectChatScreen: 'deep_link_direct_chats_screen',
          DeepLinkChannelChatScreen: 'deep_link_channel_chat_screen'
        }
      },
      AccountSettingScreen: {
        initialRouteName: 'account_setting_screen',
        screens: {
          PrivacyScreen: 'privacy_screen',
          AccountSettingScreen: 'account_setting_screen'
        }
      },
      CommunityScreen: {
        initialRouteName: 'PassportScreen',
        screens: {
          InboxScreen: 'inbox_screen',
          PassportScreen: 'passport_screen',
          CommunityScreen: 'community_screen'
        }
      }
    }
  };

  const linking: LinkingOptions = {
    prefixes: ['betribl://app', 'https://betribl.com/app'],
    config: deepLinksConfig,

    // Custom function to get the URL which was used to open the app
    async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      const url = await Linking.getInitialURL();

      if (url != null) return url;

      // Check whether an initial notification is available
      const remoteMessage = await messaging().getInitialNotification();

      if (!remoteMessage) return null;
      const data = (remoteMessage.data as unknown) as NotificationMessage;

      // Get deep link from data
      // if this is undefined, the app will open the default/home page
      return constructLinkParams(data);
    },

    subscribe(listener) {
      const onReceiveURL = ({ url }: { url: string }) => listener(url);

      // Listen to incoming links from deep linking
      Linking.addEventListener('url', onReceiveURL);

      // Listen to firebase push notifications
      const unsubscribeNotification = messaging().onNotificationOpenedApp(
        (message) => {
          crashlytics.log(
            `DEEP LINK NOTIFICATION MESSAGE, ${JSON.stringify(message)}`
          );

          const data = (message?.data as unknown) as NotificationMessage;

          // Any custom logic to check whether the URL needs to be handled
          // Call the listener to let React Navigation handle the URL
          listener(constructLinkParams(data));
        }
      );

      return () => {
        // Clean up the event listeners
        Linking.removeEventListener('url', onReceiveURL);
        unsubscribeNotification();
      };
    }
  };

  const constructLinkParams = (data: NotificationMessage) => {
    const defaultUrl = linking.prefixes[0];

    switch (data?.type) {
      case IFCMMessageTypes.CHANNEL_MESSAGE_RECEIVED:
        return `${defaultUrl}/${data.link_url}?channelId=${data.channelId}&avatar=${data.sender_image}&title=${data.sender_title}&id=${data.sender_id}`;

      case IFCMMessageTypes.DIRECT_MESSAGE_RECEIVED:
        return `${defaultUrl}/${data.link_url}?channelId=${data.channelId}&avatar=${data.sender_image}&title=${data.sender_title}&id=${data.sender_id}`;

      case IFCMMessageTypes.THREAD_MESSAGE_RECEIVED:
        return `${defaultUrl}/${data.link_url}?channelId=${data.channelId}&avatar=${data.sender_image}&title=${data.sender_title}&id=${data.sender_id}`;

      case IFCMMessageTypes.CONNECTION_REQUEST_ACCEPTED:
        return `${defaultUrl}/member_detail_screen?connectionAccepted=${true}&id=${
          data.senderId
        }&title=${data.senderName}`;

      case IFCMMessageTypes.CONNECTION_REQUEST_RECEIVED:
        changeConnectionNotification({
          variables: { showConnectionNotificationBadge: true }
        });
        return `${defaultUrl}/connection_request_screen`;

      case IFCMMessageTypes.CHANNEL_INVITATION_RECEIVED:
        return `${defaultUrl}/deep_link_channel_chat_screen?channelId=${data.channelId}&title=${data.channelName}`;

      case IFCMMessageTypes.COMMUNITY_REQUEST_ACCEPTED:
        return `${defaultUrl}/tribe_request_screen`;

      case IFCMMessageTypes.COMMUNITY_INVITE_ACCEPTED:
        // return `${defaultUrl}/tribe_request_screen?tribeAccepted=${true}&id=${
        //   data.channelId
        // }&title=${data.senderName}`;
        return `${defaultUrl}`;

      case IFCMMessageTypes.COMMUNITY_INVITE_RECEIVED:
        changeTribeRequestNotification({
          variables: { showTribeRequestNotificationBadge: true }
        });
        return `${defaultUrl}/tribe_request_screen`;

      default:
        return `${defaultUrl}`;
    }
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          headerBackTitleStyle: {
            fontFamily: fonts.WORK_SANS_MEDIUM,
            color: colors.PRIMARY_TEXT,
            fontSize: fonts.MEDIUM_SIZE,
            textTransform: 'capitalize'
          }
        }}
      >
        <RootStack.Screen
          name="SplashScreen"
          component={Screens.SplashScreen}
        />

        <RootStack.Screen
          name="WalkThroughScreen"
          component={Screens.WalkThroughScreen}
        />

        <RootStack.Screen name="SignupScreen" component={SignupNavigator} />

        <RootStack.Screen name="PreviewScreen" component={PreviewNavigator} />

        <RootStack.Screen
          name="DrawerScreen"
          component={DrawerStackNavigator}
        />
        <RootStack.Screen name="TriblPayScreen" component={TriblPayNavigator} />

        <RootStack.Screen
          name="AccountSettingScreen"
          component={AccountNavigator}
        />

        <RootStack.Screen name="CommunityScreen" component={BottomNavigator} />
      </RootStack.Navigator>

      <CustomDrawer />
    </NavigationContainer>
  );
}
