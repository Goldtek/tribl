import { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { TFunction, i18n } from 'i18next';

// App Navigation prop types
export type RootStackParamList = {
  WalkThroughScreen: undefined;
  CommunityScreen: undefined;
  ProfileScreen: undefined;
  InboxScreen: undefined;
  TriblScreen: undefined;
  SignupScreen: undefined;
  LoginScreen: undefined;
  SelectCountryScreen: undefined;
  OTPScreen: undefined;
};

interface StackScreenInterface {
  navigation: StackNavigationProp<RootStackParamList, string>;
  route: RouteProp<RootStackParamList, string>;
}

export interface NavigationInterface extends StackScreenInterface {
  testID?: string;
}
