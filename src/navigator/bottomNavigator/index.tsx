import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import CommunityNavigator from '../communityNavigator';
import PassportNavigator from '../passportNavigator';
import { GET_MESSAGE_NOTIFICATION_BADGE } from '../../graphql/cache/query';
import CommunityIcon from '../../../assets/icons/communityIcon';
import PassportIcon from '../../../assets/icons/passportIcon';
import InboxIcon from '../../../assets/icons/inboxIcon';
import ChatNavigator from '../chatNavigator';
import { ShowMessageNotificationBadge } from '../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { IconContainer, Label, BadgeWrapper } from './styles';

export type TabBarIconTypes = { color: string };

const BottomTab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<ShowMessageNotificationBadge>(
    GET_MESSAGE_NOTIFICATION_BADGE
  );

  return (
    <BottomTab.Navigator
      initialRouteName="CommunityScreen"
      activeColor={colors.PRIMARY}
      inactiveColor={colors.SECONDARY_TEXT}
      barStyle={{ backgroundColor: colors.WHITE }}
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
              {data?.showMessageNotificationBadge ? <BadgeWrapper /> : null}
              <Label style={{ color }}>
                {t(`community.bottomLabels.inbox`)}
              </Label>
            </IconContainer>
          )
        }}
      />

      <BottomTab.Screen
        name="PassportScreen"
        component={PassportNavigator}
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
