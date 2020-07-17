import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import { Button } from 'react-native-paper';
import Screens from '../../screens/signup';
import GetStartedNavigator from './getStartedNavigator';
import { useThemeContext } from '../../theme';
import { useTranslation } from 'react-i18next';
import { DEVICE_OS } from '../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { GLOBAL_HEADER_STYLE } from '../../constants';

const SignupStack = createStackNavigator();

export default function SignupNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <SignupStack.Navigator
      screenOptions={({ route, navigation }) => {
        const headerTitle = t(`signup.userRegSteps.${[route.name]}`);

        const handleNavigation = () => {
          headerTitle
            ? navigation.navigate(route.name)
            : navigation.reset({
                index: 0,
                routes: [{ name: 'CommunityScreen' }]
              });
        };

        return {
          headerShown: true,
          headerTitle: headerTitle,
          headerTitleStyle: { color: colors.SECONDARY_TEXT },
          headerTintColor: colors.PRIMARY,
          headerBackTitleVisible: false,
          headerPressColorAndroid: colors.PRIMARY,
          headerRight: () => (
            <Button
              mode="text"
              color={colors.PRIMARY}
              labelStyle={{
                fontSize: fonts.MEDIUM_SIZE,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                color: headerTitle ? colors.PRIMARY : colors.WHITE
              }}
              onPress={handleNavigation}
            >
              {t(headerTitle ? 'signup.skipSignup' : 'signup.finishSignup')}
            </Button>
          ),
          headerLeftContainerStyle: {
            marginLeft: DEVICE_OS === 'ios' ? 13 : 3
          },
          headerRightContainerStyle: { marginRight: 5 },
          headerStyle: GLOBAL_HEADER_STYLE,
          ...TransitionPresets.SlideFromRightIOS
        };
      }}
    >
      <SignupStack.Screen
        name="SignupScreen"
        component={GetStartedNavigator}
        options={{ headerShown: false }}
      />

      <SignupStack.Screen
        name="OTPScreen"
        component={Screens.OTPScreen}
        options={{ headerRight: () => null }}
      />

      <SignupStack.Screen
        name="CreateAccountScreen"
        component={Screens.CreateAccountScreen}
        options={{
          headerRight: () => null,
          headerTitleStyle: {
            marginLeft: DEVICE_OS === 'android' ? RFValue(7) : 0
          }
        }}
      />

      <SignupStack.Screen
        name="AvatarUploadScreen"
        component={Screens.AvatarUploadScreen}
        options={{
          headerTitleStyle: {
            marginLeft: DEVICE_OS === 'android' ? RFValue(7) : 0
          }
        }}
      />

      <SignupStack.Screen
        name="IdentifyUserScreen"
        component={Screens.IdentifyUserScreen}
      />

      <SignupStack.Screen
        name="UserLocationScreen"
        component={Screens.UserLocationScreen}
      />

      <SignupStack.Screen
        name="PassportScreen"
        component={Screens.PassportScreen}
        options={{
          headerTitle: () => null,
          headerStyle: {
            backgroundColor: colors.PRIMARY,
            ...GLOBAL_HEADER_STYLE
          }
        }}
      />
    </SignupStack.Navigator>
  );
}
