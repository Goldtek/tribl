import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import FastImage from 'react-native-fast-image';
import CommunityNavigator from '../communityNavigator';
import PassportNavigator from '../passportNavigator';
import { GET_MESSAGE_NOTIFICATION_BADGE } from '../../graphql/cache/query';
import CommunityIcon from '../../../assets/icons/communityIcon';
import { USER_DEFAULT_AVATAR } from '../../constants';
import InboxIcon from '../../../assets/icons/inboxIcon';
import ChatNavigator from '../chatNavigator';
import {
  MyPassportInterface,
  ShowMessageNotificationBadge
} from '../../graphql/types';
import { GET_USER_PASSPORT } from '../../graphql/server/query';

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

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

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
              <FastImage
                source={{
                  uri: userData?.myPassport.avatar || USER_DEFAULT_AVATAR,
                  priority: FastImage.priority.high
                }}
                resizeMode={FastImage.resizeMode.stretch}
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 25 / 2
                }}
              />
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
