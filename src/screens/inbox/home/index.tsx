import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useThemeContext } from '../../../theme';
import DirectMessageTab from './directMessageTab';
import ChannelsTab from './channelsTab';
import MessageRequestTab from './messageRequestTab';
import { StatusBar } from 'expo-status-bar';
import { GLOBAL_HEADER_STYLE } from '../../../constants';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';

const Tab = createMaterialTopTabNavigator();

export default function InboxScreen() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Fragment>
      <StatusBar translucent animated style="dark" />
      <Tab.Navigator
        tabBarOptions={{
          scrollEnabled: true,
          labelStyle: {
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            marginHorizontal: 0
          },
          indicatorStyle: {
            backgroundColor: colors.PRIMARY,
            height: RFValue(4)
          },
          tabStyle: { width: DEVICE_FULL_WIDTH / 3 },
          style: {
            ...GLOBAL_HEADER_STYLE,
            paddingTop: RFValue(10)
          }
        }}
        sceneContainerStyle={{ flex: 1, backgroundColor: colors.WHITE }}
        style={{ flex: 1, backgroundColor: colors.WHITE }}
      >
        <Tab.Screen
          name="DirectMessageTab"
          component={DirectMessageTab}
          options={{ tabBarLabel: t('community.chat.message') }}
        />
        <Tab.Screen
          name="ChannelsTab"
          component={ChannelsTab}
          options={{ tabBarLabel: t('community.chat.channels') }}
        />
        <Tab.Screen
          name="RequestTab"
          component={MessageRequestTab}
          options={{ tabBarLabel: t('community.chat.request') }}
        />
      </Tab.Navigator>
    </Fragment>
  );
}
