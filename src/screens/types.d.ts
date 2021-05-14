import { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { TFunction, i18n } from 'i18next';
import { StackActionHelpers } from '@react-navigation/native';
import { PassportInterface } from '../graphql/types';

interface ChatScreenProps extends PassportInterface {
  role: any;
  title: string;
  chatId: string;
  channelId: string;
  receiverId: string;
  newly_created_group?: boolean;
  channel?: { community: string; name: string };
  moderators?: PassportInterface[];
}

interface MessageRequestScreenProps extends PassportInterface {
  title: string;
  chatId: string;
  senderId: string;
  receiverId: string;
}

// App Navigation prop types
export type RootStackParamList = {
  MemberDetailScreen: { title: string; details: Object };
  CommunitySearchScreen: { index: number };
  ConnectionChatScreen: ChatScreenProps;
  MessageRequestChatScreen: ChatScreenProps;
  MessageRequestScreen?: Object;
  DirectChatScreen: ChatScreenProps;
  DeepLinkDirectChatScreen?: ChatScreenProps;
  DirectMessageTab?: Object;
  SignupPassportScreen?: Object;
  ChannelsTab?: Object;
  DrawerScreen?: Object;
  PrivacyPolicyScreen?: Object;
  ThreadChatScreen?: Object;
  MessageRequestTab?: Object;
  CommunityDetailScreen?: Object;
  ConnectionRequestScreen?: Object;
  GetStartedScreen?: Object;
  AccountSettingScreen?: Object;
  SelectCountryScreen?: Object;
  ChannelChatScreen?: Object;
  DeepLinkChannelChatScreen?: Object;
  CommunityScreen?: Object;
  CreateAccountScreen?: Object;
  MemberDetailScreen?: Object;
  AvatarUploadScreen?: Object;
  IdentifyUserScreen?: Object;
  UserLocationScreen?: Object;
  WalkThroughScreen?: Object;
  BirthPlaceScreen?: Object;
  MyConnectionScreen?: Object;
  MemberPassportScreen?: Object;
  NewMessageScreen?: Object;
  MessageRequestChatScreen?: Object;
  NewChatSearch?: Object;
  SelectGroupParticipantsScreen?: Object;
  AddMembersToGroupScreen?: Object;
  PassportScreen?: Object;
  PrivacyScreen?: Object;
  ProfileScreen?: Object;
  SignupScreen?: Object;
  SplashScreen?: Object;
  SignupPassportScreen?: Object;
  SelectCountry?: Object;
  InboxScreen?: Object;
  TriblScreen?: Object;
  ThreadScreen?: Object;
  CreateGroupScreen?: Object;
  TribeChannelScreen?: Object;
  TribeHighlightScreen?: Object;
  TribeMembersScreen?: Object;
  LoginScreen?: Object;
  LocationScreen?: Object;
  OTPScreen?: Object;
  ViewAllScreen?: Object;
  ViewAllTribes?: Object;
  ViewAllMembers?: Object;
  GroupInformationScreen?: Object;
  AddTags?: Object;
  CommunityAlgoliaScreen?: Object;
  DirectMessageInformation?: Object;
  ChannelMembersScreen?: Object;
  GroupMembersScreen?: Object;
  ConnectionListScreen?: Object;
  CommunityListScreen?: Object;
  UserConnectionListScreen?: Object;
  UserCommunityListScreen?: Object;
  CreateTribeScreen?: Object;
  AddAdminScreen?: Object;
  TribeDetailScreen?: Object;
  NewTribeScreen?: Object;
  NotificationScreen?: Object;
  InviteToTribeScreen?: Object;
  CommunityRequestScreen?: Object;
  CitizenshipScreen?: Object;
  InvitationToChannelScreen?: Object;
  ChannelInformationScreen?: Object;
  InviteToTribeFromProfileScreen?: Object;
  InviteToChannelFromProfileScreen?: Object;
  ActivateWalletScreen?: Object;
  TriblPayScreen?: Object;
  BankCountryScreen?: Object;
  CountryIdScreen?: Object;
  VerifyIdentityScreen?: Object;
  LinkAccountScreen?: Object;
  WalletScreen?: Object;
  AddCashScreen?: Object;
  CreateChannelTribeScreen?: Object;
  CreateChannelNameScreen?: Object;
  CreateChannelParticipant?: Object;
  BlockedAccountScreen?: Object;
  ChannelRequestScreen?: Object;
  TribeRequestScreen?: Object;
  PreviewScreen?: Object;
  TribeDetailScreen?: Object;
  MemberPassportDetailScreen?: Object;
  WaitlistScreen?: Object;
  DocumentTypeSelectionScreen?: Object;
  FailedWalletStatusScreen?: Object;
  PendingWalletStatusScreen?: Object;
  BillingDetailsScreen?: Object;
  SelfieScreen?: Object;
};

export type RootStackParamScreensList =
  | 'CommunitySearchScreen'
  | 'MemberDetailScreen'
  | 'DirectMessageTab'
  | 'GroupMembersScreen'
  | 'SignupPassportScreen'
  | 'CommunityDetailScreen'
  | 'ConnectionChatScreen'
  | 'ConnectionRequestScreen'
  | 'DirectMessageInformation'
  | 'GroupInformationScreen'
  | 'ChannelChatScreen'
  | 'DeepLinkChannelChatScreen'
  | 'MessageRequestTab'
  | 'AccountSettingScreen'
  | 'SelectCountry'
  | 'DrawerScreen'
  | 'ThreadChatScreen'
  | 'SelectCountryScreen'
  | 'CreateAccountScreen'
  | 'MemberDetailScreen'
  | 'MessageRequestChatScreen'
  | 'MessageRequestScreen'
  | 'CreateGroupScreen'
  | 'AvatarUploadScreen'
  | 'IdentifyUserScreen'
  | 'UserLocationScreen'
  | 'WalkThroughScreen'
  | 'BirthPlaceScreen'
  | 'DirectChatScreen'
  | 'DeepLinkDirectChatScreen'
  | 'AddMembersToGroupScreen'
  | 'NewMessageScreen'
  | 'CommunityScreen'
  | 'PassportScreen'
  | 'ChannelsTab'
  | 'SelectGroupParticipantsScreen'
  | 'ThreadScreen'
  | 'MyConnectionScreen'
  | 'MemberPassportScreen'
  | 'GetStartedScreen'
  | 'NewChatSearch'
  | 'PrivacyScreen'
  | 'PrivacyPolicyScreen'
  | 'ProfileScreen'
  | 'SignupScreen'
  | 'SplashScreen'
  | 'SignupPassportScreen'
  | 'InboxScreen'
  | 'TriblScreen'
  | 'TribeChannelScreen'
  | 'TribeHighlightScreen'
  | 'TribeMembersScreen'
  | 'LoginScreen'
  | 'LocationScreen'
  | 'OTPScreen'
  | 'ViewAllScreen'
  | 'ViewAllMembers'
  | 'ViewAllTribes'
  | 'AddTags'
  | 'CommunityAlgoliaScreen'
  | 'ChannelMembersScreen'
  | 'ConnectionListScreen'
  | 'CommunityListScreen'
  | 'UserCommunityListScreen'
  | 'UserConnectionListScreen'
  | 'CreateTribeScreen'
  | 'AddAdminScreen'
  | 'TribeDetailScreen'
  | 'NewTribeScreen'
  | 'NotificationScreen'
  | 'InviteToTribeScreen'
  | 'CommunityRequestScreen'
  | 'CitizenshipScreen'
  | 'InvitationToChannelScreen'
  | 'ChannelInformationScreen'
  | 'InviteToTribeFromProfileScreen'
  | 'InviteToChannelFromProfileScreen'
  | 'ActivateWalletScreen'
  | 'TriblPayScreen'
  | 'BankCountryScreen'
  | 'CountryIdScreen'
  | 'VerifyIdentityScreen'
  | 'LinkAccountScreen'
  | 'WalletScreen'
  | 'AddCashScreen'
  | 'CreateChannelTribeScreen'
  | 'CreateChannelNameScreen'
  | 'CreateChannelParticipant'
  | 'BlockedAccountScreen'
  | 'ChannelRequestScreen'
  | 'TribeRequestScreen'
  | 'PreviewScreen'
  | 'TribeDetailScreen'
  | 'MemberPassportDetailScreen'
  | 'WaitlistScreen'
  | 'BillingDetailsScreen'
  | 'DocumentTypeSelectionScreen'
  | 'SelfieScreen'
  | 'FailedWalletStatusScreen'
  | 'PendingWalletStatusScreen'

interface StackNavigationInterface extends StackActionHelpers {
  toggleDrawer(): void;
}

interface StackScreenInterface {
  navigation: StackNavigationProp<RootStackParamList, string> &
    StackNavigationInterface;
  route: RouteProp<RootStackParamList, string>;
}

export interface NavigationInterface extends StackScreenInterface {
  testID?: string;
}
