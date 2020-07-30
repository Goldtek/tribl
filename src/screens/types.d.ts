import { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { TFunction, i18n } from 'i18next';
import { StackActionHelpers } from '@react-navigation/native';

// App Navigation prop types
export type RootStackParamList = {
  SelectCountryScreen: undefined;
  CreateAccountScreen: undefined;
  AvatarUploadScreen: undefined;
  IdentifyUserScreen: undefined;
  UserLocationScreen: undefined;
  WalkThroughScreen: undefined;
  CommunityScreen: undefined;
  ProfileScreen: undefined;
  SignupScreen: undefined;
  InboxScreen: undefined;
  TriblScreen: undefined;
  LoginScreen: undefined;
  OTPScreen: undefined;
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
