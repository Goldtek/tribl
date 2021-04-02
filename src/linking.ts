import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { LinkingOptions } from '@react-navigation/native';

// Deep links
const deepLinksConfig = {
  screens: {
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
        UserConnectionListScreen: 'user_connection_list_screen'
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

    // Check if there is an initial firebase notification
    const message = await messaging().getInitialNotification();

    // Get deep link from data
    // if this is undefined, the app will open the default/home page
    return message?.data?.link;
  },

  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Listen to firebase push notifications
    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      (message) => {
        console.log(
          'LinkingOptions LinkingOptions LinkingOptions LinkingOptions LinkingOptions LinkingOptions LinkingOptions LinkingOptions',
          message
        );

        const url = JSON.stringify(message?.data);

        if (url) {
          // Any custom logic to check whether the URL needs to be handled
          // Call the listener to let React Navigation handle the URL
          listener(url);
        }
      }
    );

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
      unsubscribeNotification();
    };
  }
};

export default linking;
