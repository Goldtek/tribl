import React, { Fragment } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/account';
import { Feather, Ionicons } from '@expo/vector-icons';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { MenuBadgeWrapper } from '../bottomNavigator/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  ShowConnectionNotificationBadge,
  ShowSideMenu
} from '../../graphql/types';
import {
  GET_CONNECTION_NOTIFICATION_BADGE,
  GET_SIDE_MENU
} from '../../graphql/cache/query';
import {
  CHANGE_ACTIVE_SIDE_MENU_STATE,
  TOGGLE_SIDE_MENU
} from '../../graphql/cache/mutations';
import { logEvent } from '../../utils/uxcamHelper';
import { Mixpanel } from '../../config';
import { TouchableRipple } from 'react-native-paper';

const AccountStack = createStackNavigator();

interface AccountNavigatorProps extends NavigationInterface {}

export default function AccountNavigator(props: AccountNavigatorProps) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);
  const [changeSideMenuState] = useMutation(CHANGE_ACTIVE_SIDE_MENU_STATE);

  const toggleMenu = () => {
    toggleSideMenu({ variables: { showSideMenu: !drawerData?.showSideMenu } });
  };

  const changeSideMenu = (menu: string) => {
    changeSideMenuState({ variables: { activeSideMenu: menu } });
  };

  return (
    <AccountStack.Navigator
      headerMode="screen"
      screenOptions={{ headerStyle: { height: RFValue(90) } }}
    >
      <AccountStack.Screen
        name="AccountSettingScreen"
        component={Screens.AccountSettingScreen}
        options={{
          //@ts-ignore
          headerTitle: t(`community.sideNav.settings`),
          headerLeft: (props) => (
            <TouchableHighlight
              {...props}
              onPress={() => {
                toggleMenu();
                Mixpanel.track('User Taps Side Drawer', {
                  info: `User taps side drawer on account setting screen`,
                  'Activity Screen': 'Account Setting Screen'
                });
                logEvent('open drawer', { from: 'community' });
              }}
              underlayColor={hexToRGB(colors.PRIMARY, 0.1)}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                borderRadius: RFValue(20),
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Fragment>
                <Feather
                  name="menu"
                  size={RFValue(25)}
                  color={colors.PRIMARY_TEXT}
                />
                {data?.showConnectionNotificationBadge ? (
                  <MenuBadgeWrapper />
                ) : null}
              </Fragment>
            </TouchableHighlight>
          ),
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        }}
      />

      <AccountStack.Screen
        name="PrivacyScreen"
        component={Screens.PrivacyScreen}
        options={{
          //@ts-ignore
          headerTitle: t(`community.accountSettings.privacy`),
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        }}
      />

      <AccountStack.Screen
        name="PrivacyPolicyScreen"
        component={Screens.PrivacyPolicyScreen}
        options={({ route }: any) => ({
          headerTitle: t(`community.accountSettings.privacyPolicy`),
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerLeft: () => (
            <TouchableRipple
              onPress={() => {
                changeSideMenu(route.params.previousMenu);
                navigation.goBack();
              }}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Ionicons
                name="md-arrow-back"
                size={RFValue(24)}
                color={colors.PRIMARY_TEXT}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />
    </AccountStack.Navigator>
  );
}
