import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CommunityNavigator from '../communityNavigator';
import PassportNavigator from '../passportNavigator';
import ChatNavigator from '../chatNavigator';
import TabBar from './TabBar';

// IMPORT FOR ALL CUSTOM STYLES
export type TabBarIconTypes = { color: string };

const BottomTab = createBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <BottomTab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <BottomTab.Screen name="CommunityScreen" component={CommunityNavigator} />
      <BottomTab.Screen name="InboxScreen" component={ChatNavigator} />
      <BottomTab.Screen name="PassportScreen" component={PassportNavigator} />
    </BottomTab.Navigator>
  );
}
