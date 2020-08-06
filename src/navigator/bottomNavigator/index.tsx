import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CommunityIcon from '../../../assets/icons/communityIcon';
import PassportIcon from '../../../assets/icons/passportIcon';
import InboxIcon from '../../../assets/icons/inboxIcon';
import CommunityNavigator from '../communityNavigator';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import ChatNavigator from '../chatNavigator';
import Screens from '../../screens';

// IMPORT FOR ALL CUSTOM STYLES
import { IconContainer, Label } from './styles';

export type TabBarIconTypes = { color: string };

const BottomTab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

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
              <Label style={{ color }}>
                {t(`community.bottomLabels.community`)}
              </Label>
            </IconContainer>
          )
        }}
      />

      <BottomTab.Screen
        name="InboxScreen"
        component={ChatNavigator}
        options={{
          tabBarIcon: ({ color }: TabBarIconTypes) => (
            <IconContainer>
              <InboxIcon fillColor={color} />
              <Label style={{ color }}>
                {t(`community.bottomLabels.inbox`)}
              </Label>
            </IconContainer>
          )
        }}
      />

      <BottomTab.Screen
        name="PassportScreen"
        component={Screens.PassportScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconTypes) => (
            <IconContainer>
              <PassportIcon fillColor={color} />
              <Label style={{ color }}>
                {t(`community.bottomLabels.passport`)}
              </Label>
            </IconContainer>
          )
        }}
      />
    </BottomTab.Navigator>
  );
}
