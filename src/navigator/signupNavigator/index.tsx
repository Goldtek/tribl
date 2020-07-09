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

const SignupStack = createStackNavigator();

export default function SignupNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <SignupStack.Navigator
      screenOptions={({ route }) => {
        const headerTitle = t(`signup.userRegSteps.${[route.name]}`);
        const hideSkipOption =
          headerTitle.includes('1') || headerTitle.includes('2');

        const avatarScreen =
          headerTitle.includes('3') && DEVICE_OS === 'android';

        return {
          headerShown: true,
          headerTitle: headerTitle,
          headerTitleStyle: {
            color: colors.SECONDARY_TEXT,
            marginLeft: avatarScreen ? RFValue(7) : 0
          },
          headerTintColor: colors.PRIMARY,
          headerBackTitleVisible: false,
          headerPressColorAndroid: colors.PRIMARY,
          headerRight: () =>
            !hideSkipOption ? (
              <Button
                mode="text"
                color={colors.PRIMARY}
                labelStyle={{
                  fontSize: fonts.MEDIUM_SIZE,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD
                }}
                onPress={() => console.log('SKP ON HEADER PRESSED')}
              >
                {t('signup.skipSignup')}
              </Button>
            ) : null,
          headerLeftContainerStyle: {
            marginLeft: DEVICE_OS === 'ios' ? 13 : 3
          },
          headerRightContainerStyle: { marginRight: 5 },
          headerStyle: {
            shadowOpacity: 0,
            shadowOffset: { height: 0 },
            shadowRadius: 0,
            elevation: 0
          },
          ...TransitionPresets.SlideFromRightIOS
        };
      }}
    >
      <SignupStack.Screen
        name="SignupScreen"
        component={GetStartedNavigator}
        options={{ headerShown: false }}
      />

      <SignupStack.Screen name="OTPScreen" component={Screens.OTPScreen} />

      <SignupStack.Screen
        name="CreateAccountScreen"
        component={Screens.CreateAccountScreen}
      />

      <SignupStack.Screen
        name="AvatarUploadScreen"
        component={Screens.AvatarUploadScreen}
      />

      <SignupStack.Screen
        name="IdentifyUserScreen"
        component={Screens.IdentifyUserScreen}
      />

      <SignupStack.Screen
        name="UserLocationScreen"
        component={Screens.UserLocationScreen}
      />
    </SignupStack.Navigator>
  );
}
