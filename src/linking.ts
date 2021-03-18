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
        AddAdminScreen: 'add_admin_creen',
        MyConnections: 'my_connections_screen',
        ThreadChatScreen: 'thread_chat_screen',
        NewMessageScreen: 'new_message_screen',
        DirectChatScreen: 'direct_chats_creen',
        CreateTribeScreen: 'create_tribe_creen',
        ChannelChatScreen: 'channel_chat_creen',
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
  prefixes: ['betribl://'],
  config: deepLinksConfig
};

export default linking;
