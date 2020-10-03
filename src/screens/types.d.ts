import { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { TFunction, i18n } from 'i18next';
import { StackActionHelpers } from '@react-navigation/native';
import { PassportInterface } from '../graphql/types';

interface ChatScreenProps extends PassportInterface {
  title: string;
  receiverId: string;
  chatId: string;
}

interface MessageRequestScreenProps extends PassportInterface {
  title: string;
  senderId: string;
  chatId: string;
}

// App Navigation prop types
export type RootStackParamList = {
  CommunitySearchScreen: { index: number };
  ConnectionChatScreen?: ChatScreenProps;
  DirectChatScreen: ChatScreenProps;
  SelectCountryScreen?: Object;
  CreateAccountScreen?: Object;
  AvatarUploadScreen?: Object;
  IdentifyUserScreen?: Object;
  UserLocationScreen?: Object;
  WalkThroughScreen?: Object;
  NewMessageScreen?: Object;
  NewMessageScreen?: Object;
  CommunityScreen?: Object;
  NewChatSearch?: Object;
  PrivacyScreen?: Object;
  ProfileScreen?: Object;
  SignupScreen?: Object;
  InboxScreen?: Object;
  TriblScreen?: Object;
  LoginScreen?: Object;
  OTPScreen?: Object;
  PassportScreen?: Object;
  CommunityDetailScreen?: Object;
  MemberDetailScreen?: Object;
};

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
