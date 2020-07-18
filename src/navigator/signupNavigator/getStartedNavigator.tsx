import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import Screens from '../../screens/signup';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { DEVICE_OS } from '../../utils/device';
import { useThemeContext } from '../../theme';

const GetStartedStack = createStackNavigator();

export default function GetStartedNavigator() {
  const { colors } = useThemeContext();

  return (
    <GetStartedStack.Navigator
      mode="modal"
      screenOptions={() => {
        return {
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          headerStyle: GLOBAL_HEADER_STYLE,
          ...TransitionPresets.ModalPresentationIOS
        };
      }}
    >
      <GetStartedStack.Screen
        name="SignupScreen"
        component={Screens.GetStartedScreen}
      />

      <GetStartedStack.Screen
        name="SelectCountryScreen"
        options={{
          headerShown: true,
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: {
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 10
          }
        }}
        component={Screens.SelectCountryScreen}
      />
    </GetStartedStack.Navigator>
  );
}
