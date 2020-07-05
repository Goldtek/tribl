import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Screens from '../../screens';

const CommunityStack = createStackNavigator();

export default function CommunityNavigator() {
  return (
    <CommunityStack.Navigator
      initialRouteName="CommunityScreen"
      headerMode="screen"
    >
      <CommunityStack.Screen
        name="CommunityScreen"
        component={Screens.CommunityScreen}
        options={{ headerTitle: 'community' }}
      />
    </CommunityStack.Navigator>
  );
}
