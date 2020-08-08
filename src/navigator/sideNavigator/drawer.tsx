import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens';
import { Text } from 'react-native-paper';
import {
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
  Feather,
  FontAwesome
} from '@expo/vector-icons';
import BottomNavigator from '../bottomNavigator';
import CustomDrawerContent from './customDrawerComponent';
import ChatNavigator from '../chatNavigator';

const Drawer = createDrawerNavigator();

export default function SideDrawerNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerType="slide"
      openByDefault={false}
      drawerStyle={{ backgroundColor: colors.GREY }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerContentOptions={{ itemStyle: { marginVertical: 5 } }}
    >
      <Drawer.Screen
        name="CommunityScreen"
        component={BottomNavigator}
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="google-circles-communities"
              size={24}
              color={colors.PRIMARY_TEXT}
            />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(13),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.community`)}
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatNavigator}
        options={{
          drawerIcon: () => (
            <Entypo name="new-message" size={24} color={colors.PRIMARY_TEXT} />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(13),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.chat`)}
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="Connection"
        component={Screens.UpcomingScreen}
        options={{
          drawerIcon: () => (
            <SimpleLineIcons
              name="user-follow"
              size={24}
              color={colors.PRIMARY_TEXT}
            />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(13),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.request`)}
            </Text>
          )
        }}
      />

      <Drawer.Screen
        name="wallet"
        component={Screens.UpcomingScreen}
        options={{
          drawerIcon: () => (
            <Feather name="dollar-sign" size={24} color={colors.PRIMARY_TEXT} />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(13),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.wallet`)}
            </Text>
          )
        }}
      />

      <Drawer.Screen
        name="settings"
        component={Screens.UpcomingScreen}
        options={{
          drawerIcon: () => (
            <Entypo name="cog" size={24} color={colors.PRIMARY_TEXT} />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(13),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.settings`)}
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="invite"
        component={Screens.UpcomingScreen}
        options={{
          drawerIcon: () => (
            <Entypo name="plus" size={24} color={colors.PRIMARY_TEXT} />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(13),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.invite`)}
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="policy"
        component={Screens.UpcomingScreen}
        options={{
          drawerIcon: () => (
            <FontAwesome
              name="user-secret"
              size={24}
              color={colors.PRIMARY_TEXT}
            />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(13),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.policy`)}
            </Text>
          )
        }}
      />
    </Drawer.Navigator>
  );
}
