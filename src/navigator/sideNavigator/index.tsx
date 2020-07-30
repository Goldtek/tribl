import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens';
import { Searchbar, Text, TouchableRipple, Divider } from 'react-native-paper';
import CommunityIcon from '../../../assets/icons/communityIcon';
import {
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
  Feather
} from '@expo/vector-icons';
import BottomNavigator from '../bottomNavigator';
import CustomDrawerContent from './customDrawerComponent';

const Drawer = createDrawerNavigator();

export default function SideDrawerNavigator() {
  const { colors, fonts } = useThemeContext();

  return (
    <Drawer.Navigator
      drawerType="slide"
      drawerStyle={{ backgroundColor: colors.GREY }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerContentOptions={{
        itemStyle: { marginVertical: 5 }
      }}
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
              community
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={Screens.InboxScreen}
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
              chat
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="Connection"
        component={Screens.InboxScreen}
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
              connection requests
            </Text>
          )
        }}
      />

      <Drawer.Screen
        name="wallet"
        component={Screens.InboxScreen}
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
              add wallet
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="settings"
        component={Screens.InboxScreen}
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
              privacy settings
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="invite"
        component={Screens.InboxScreen}
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
              invite friends
            </Text>
          )
        }}
      />
      {/* <Drawer.Screen name="Passport" component={Screens.PassportScreen} /> */}
    </Drawer.Navigator>
  );
}
