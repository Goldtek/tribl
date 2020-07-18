import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CommunityIcon from '../../../assets/icons/communityIcon';
import ProfileIcon from '../../../assets/icons/profileIcon';
import InboxIcon from '../../../assets/icons/inboxIcon';
import TriblIcon from '../../../assets/icons/tribIcon';
import CommunityNavigator from '../communityNavigator';
import { useThemeContext } from '../../theme';
import Screens from '../../screens';

// IMPORT FOR ALL CUSTOM STYLES
import { IconContainer, Label } from './styles';

export type TabBarIconTypes = { color: string };

const BottomTab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const { colors } = useThemeContext();

  return (
    <BottomTab.Navigator
      activeColor={colors.PRIMARY}
      inactiveColor={colors.SECONDARY_TEXT}
      barStyle={{ backgroundColor: colors.WHITE }}
      initialRouteName="CommunityScreen"
      labeled={false}
    >
      <BottomTab.Screen
        name="CommunityScreen"
        component={CommunityNavigator}
        options={{
          tabBarIcon: ({ color }: TabBarIconTypes) => (
            <IconContainer>
              <CommunityIcon fillColor={color} />
              <Label style={{ color }}>community</Label>
            </IconContainer>
          )
        }}
      />

      <BottomTab.Screen
        name="InboxScreen"
        component={Screens.InboxScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconTypes) => (
            <IconContainer>
              <InboxIcon fillColor={color} />
              <Label style={{ color }}>inbox</Label>
            </IconContainer>
          )
        }}
      />

      <BottomTab.Screen
        name="TriblScreen"
        component={Screens.TriblScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconTypes) => (
            <IconContainer>
              <TriblIcon fillColor={color} />
              <Label style={{ color }}>tribl</Label>
            </IconContainer>
          )
        }}
      />

      <BottomTab.Screen
        name="ProfileScreen"
        component={Screens.ProfileScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconTypes) => (
            <IconContainer>
              <ProfileIcon fillColor={color} />
              <Label style={{ color }}>passport</Label>
            </IconContainer>
          )
        }}
      />
    </BottomTab.Navigator>
  );
}
