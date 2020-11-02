import { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { TFunction, i18n } from 'i18next';
import { StackActionHelpers } from '@react-navigation/native';
import { PassportInterface } from '../graphql/types';

interface ChatScreenProps extends PassportInterface {
  title: string;
  chatId: string;
  receiverId: string;
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
  MessageRequestScreen: ChatScreenProps;
  ChannelChatScreen: ChatScreenProps;
  DirectChatScreen: ChatScreenProps;
  DirectMessageTab?: Object;
  SignupPassportScreen?: Object;
  MessageRequestTab?: Object;
  CommunityDetailScreen?: Object;
  ConnectionRequestScreen?: Object;
  GetStartedScreen?: Object;
  AccountSettingScreen?: Object;
  SelectCountryScreen?: Object;
  ChannelChatScreen?: Object;
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
  MessageRequestScreen?: Object;
  NewChatSearch?: Object;
  PassportScreen?: Object;
  PrivacyScreen?: Object;
  ProfileScreen?: Object;
  SignupScreen?: Object;
  SplashScreen?: Object;
  SignupPassportScreen?: Object;
  SelectCountry?: Object;
  InboxScreen?: Object;
  TriblScreen?: Object;
  TribeChannelScreen?: Object;
  TribeHighlightScreen?: Object;
  TribeMembersScreen?: Object;
  LoginScreen?: Object;
  LocationScreen?: Object;
  OTPScreen?: Object;
  ViewAllScreen?: Object;
  ViewAllTribes?: Object;
  ViewAllMembers?: Object;
};

export type RootStackParamScreensList =
  | 'CommunitySearchScreen'
  | 'MemberDetailScreen'
  | 'DirectMessageTab'
  | 'SignupPassportScreen'
  | 'CommunityDetailScreen'
  | 'ConnectionChatScreen'
  | 'ConnectionRequestScreen'
  | 'ChannelChatScreen'
  | 'MessageRequestTab'
  | 'AccountSettingScreen'
  | 'SelectCountry'
  | 'SelectCountryScreen'
  | 'CreateAccountScreen'
  | 'MemberDetailScreen'
  | 'MessageRequestScreen'
  | 'AvatarUploadScreen'
  | 'IdentifyUserScreen'
  | 'UserLocationScreen'
  | 'WalkThroughScreen'
  | 'BirthPlaceScreen'
  | 'DirectChatScreen'
  | 'NewMessageScreen'
  | 'CommunityScreen'
  | 'PassportScreen'
  | 'MyConnectionScreen'
  | 'MemberPassportScreen'
  | 'GetStartedScreen'
  | 'NewChatSearch'
  | 'PrivacyScreen'
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
  | 'ViewAllTribes';

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
