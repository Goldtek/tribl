import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import Screens from '../../screens/signup';

const GetStartedStack = createStackNavigator();

export default function GetStartedNavigator() {
  return (
    <GetStartedStack.Navigator
      mode="modal"
      screenOptions={() => {
        return {
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
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
        component={Screens.SelectCountryScreen}
      />
    </GetStartedStack.Navigator>
  );
}
