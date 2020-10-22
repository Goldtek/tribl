import { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { TFunction, i18n } from 'i18next';
import { StackActionHelpers } from '@react-navigation/native';
import { PassportInterface } from '../graphql/types';

interface ChatScreenProps extends PassportInterface {
  title: string;
  chatId: string;
  isMember: boolean;
  receiverId: string;
}

interface MessageRequestScreenProps extends PassportInterface {
  title: string;
  chatId: string;
  receiverId: string;
}

// App Navigation prop types
export type RootStackParamList = {
  CommunitySearchScreen: { index: number };
  ConnectionChatScreen: ChatScreenProps;
  MessageRequestScreen: ChatScreenProps;
  ChannelChatScreen: ChatScreenProps;
  DirectChatScreen: ChatScreenProps;
  CommunityDetailScreen?: Object;
  SelectCountryScreen?: Object;
  CreateAccountScreen?: Object;
  MemberDetailScreen?: Object;
  AvatarUploadScreen?: Object;
  IdentifyUserScreen?: Object;
  UserLocationScreen?: Object;
  WalkThroughScreen?: Object;
  NewMessageScreen?: Object;
  CommunityScreen?: Object;
  PassportScreen?: Object;
  NewChatSearch?: Object;
  PrivacyScreen?: Object;
  ProfileScreen?: Object;
  SignupScreen?: Object;
  InboxScreen?: Object;
  TriblScreen?: Object;
  LoginScreen?: Object;
  OTPScreen?: Object;
  BirthPlaceScreen?: Object;
};

export type RootStackParamScreensList =
  | 'CommunitySearchScreen'
  | 'CommunityDetailScreen'
  | 'ConnectionChatScreen'
  | 'SelectCountryScreen'
  | 'CreateAccountScreen'
  | 'MemberDetailScreen'
  | 'AvatarUploadScreen'
  | 'IdentifyUserScreen'
  | 'UserLocationScreen'
  | 'WalkThroughScreen'
  | 'DirectChatScreen'
  | 'NewMessageScreen'
  | 'CommunityScreen'
  | 'PassportScreen'
  | 'NewChatSearch'
  | 'PrivacyScreen'
  | 'ProfileScreen'
  | 'SignupScreen'
  | 'InboxScreen'
  | 'TriblScreen'
  | 'LoginScreen'
  | 'OTPScreen'
  | 'BirthPlaceScreen';

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
