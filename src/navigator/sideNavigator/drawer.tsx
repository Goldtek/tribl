import React, { Fragment } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens';
import Screen from '../../screens/account';
import AccountNavigator from '../accountNavigator';
import { Text } from 'react-native-paper';
import {
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
  FontAwesome
} from '@expo/vector-icons';
import BottomNavigator from '../bottomNavigator';
import CustomDrawerContent from './customDrawerComponent';
import { ConnectionBadgeWrapper } from '../bottomNavigator/styles';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import { useQuery } from '@apollo/react-hooks';
import { ShowConnectionNotificationBadge } from '../../graphql/types';
import { GET_CONNECTION_NOTIFICATION_BADGE } from '../../graphql/cache/query';

const Drawer = createDrawerNavigator();

export default function SideDrawerNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  return (
    <Drawer.Navigator
      drawerType="slide"
      openByDefault={false}
      drawerStyle={{
        backgroundColor: colors.GREY,
        width: DEVICE_FULL_WIDTH - 120
      }}
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
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.community`)}
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="ConnectionRequest"
        component={Screen.ConnectionRequestScreen}
        options={{
          drawerIcon: () => (
            <Fragment>
              <SimpleLineIcons
                name="user-follow"
                size={24}
                color={colors.PRIMARY_TEXT}
              />
              {data?.showConnectionNotificationBadge ? (
                <ConnectionBadgeWrapper />
              ) : null}
            </Fragment>
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.request`)}
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="MyConnections"
        component={Screen.MyConnectionScreen}
        options={{
          drawerIcon: () => (
            <SimpleLineIcons
              name="user"
              size={24}
              color={colors.PRIMARY_TEXT}
            />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.connection`)}
            </Text>
          )
        }}
      />

      <Drawer.Screen
        name="settings"
        component={AccountNavigator}
        options={{
          drawerIcon: () => (
            <Entypo name="cog" size={24} color={colors.PRIMARY_TEXT} />
          ),
          drawerLabel: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.sideNav.settings`)}
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
                fontSize: RFValue(fonts.MEDIUM_SIZE),
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
