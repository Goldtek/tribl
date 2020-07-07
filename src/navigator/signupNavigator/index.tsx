import React from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import Screens from '../../screens/signup';
import GetStartedNavigator from './getStartedNavigator';

const SignupStack = createStackNavigator();

export default function SignupNavigator() {
  return (
    <SignupStack.Navigator screenOptions={{ headerShown: false }}>
      <SignupStack.Screen name="SignupScreen" component={GetStartedNavigator} />

      <SignupStack.Screen name="OTPScreen" component={Screens.OTPScreen} />
    </SignupStack.Navigator>
  );
}
