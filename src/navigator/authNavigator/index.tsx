import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Screens from '../../screens';

const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator headerMode="screen">
      <AuthStack.Screen name="SignupScreen" component={Screens.SignupScreen} />
    </AuthStack.Navigator>
  );
}
