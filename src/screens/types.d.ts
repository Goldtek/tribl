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
  ConnectionChatScreen: ChatScreenProps;
  DirectChatScreen: ChatScreenProps;
  SelectCountryScreen: undefined;
  CreateAccountScreen: undefined;
  AvatarUploadScreen: undefined;
  IdentifyUserScreen: undefined;
  UserLocationScreen: undefined;
  WalkThroughScreen: undefined;
  NewMessageScreen: undefined;
  NewMessageScreen: undefined;
  CommunityScreen: undefined;
  NewChatSearch: undefined;
  PrivacyScreen: undefined;
  ProfileScreen: undefined;
  SignupScreen: undefined;
  InboxScreen: undefined;
  TriblScreen: undefined;
  LoginScreen: undefined;
  OTPScreen: undefined;
  PassportScreen: undefined;
  CommunityDetailScreen: {};
  MemberDetailScreen: {};
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
