import React, { useState, useCallback, Fragment } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Platform, TouchableHighlight } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransitionPresets } from '@react-navigation/stack';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/community';
import { Feather, Entypo } from '@expo/vector-icons';
import { Menu, Divider, TouchableRipple } from 'react-native-paper';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import GradientButton from '../../components/gradientButton';
import { useQuery } from '@apollo/react-hooks';
import {
  GET_COMMUNITY_SEARCH_INDEX,
  GET_CONNECTION_NOTIFICATION_BADGE
} from '../../graphql/cache/query';
import { MenuBadgeWrapper } from '../bottomNavigator/styles';
import { ShowConnectionNotificationBadge } from '../../graphql/types';
import { DEVICE_OS } from '../../utils/device';
import { logEvent } from '../../utils/uxcamHelper';
import { Mixpanel } from '../../config';

const CommunityStack = createStackNavigator();

interface CommunityNavigatorProps extends NavigationInterface {}

export default function CommunityNavigator(props: CommunityNavigatorProps) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);
  const { data } = useQuery(GET_COMMUNITY_SEARCH_INDEX);
  const { top: safeAreaTop } = useSafeAreaInsets();

  const { data: notificationData } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const getMenuHeight = useCallback(() => {
    switch (true) {
      case Math.ceil(safeAreaTop) <= 20:
        return Math.ceil(safeAreaTop + 50);

      case Math.ceil(safeAreaTop) <= 36:
        return Math.ceil(safeAreaTop + 50);

      case Math.ceil(safeAreaTop) <= 44:
        return Math.ceil(safeAreaTop + 35);

      default:
        return Math.ceil(safeAreaTop);
    }
  }, []);

  return (
    <CommunityStack.Navigator
      initialRouteName="CommunityScreen"
      headerMode="screen"
      screenOptions={{ headerStyle: { height: RFValue(90) } }}
    >
      <CommunityStack.Screen
        name="CommunityScreen"
        component={Screens.HomeScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('../../../assets/images/logo.png')}
              style={{
                width: RFValue(50),
                height: RFValue(50),
                resizeMode: 'contain'
              }}
            />
          ),
          headerLeft: (props) => (
            <TouchableHighlight
              {...props}
              onPress={() => {
                navigation.toggleDrawer();
                Mixpanel.track('User Taps Side Drawer', {
                  info: `User taps side drawer on community screen`,
                  'Activity Screen': 'Community Screen'
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
                {notificationData?.showConnectionNotificationBadge ? (
                  <MenuBadgeWrapper />
                ) : null}
              </Fragment>
            </TouchableHighlight>
          ),
          headerRight: () => (
            <GradientButton
              gradientContainerstyle={{
                width: RFValue(30),
                height: RFValue(30),
                marginBottom: RFValue(20)
              }}
              onPress={() => {
                navigation.navigate('NewMessageScreen');
                Mixpanel.track('User Taps Chat Icon', {
                  info: `User taps chat icon on home screen`,
                  'Activity Screen': 'Home Screen'
                });
                logEvent('tap chat icon', { from: 'home' });
              }}
              labelStyle={{ paddingLeft: 3 }}
            >
              <Feather name="message-square" color={colors.WHITE} size={20} />
            </GradientButton>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: { marginRight: 10 }
        }}
      />

      <CommunityStack.Screen
        name="CommunitySearchScreen"
        component={Screens.SearchScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('../../../assets/images/logo.png')}
              style={{
                width: RFValue(50),
                height: RFValue(50),
                resizeMode: 'contain'
              }}
            />
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeft: (props) => (
            <TouchableHighlight
              {...props}
              onPress={() => {
                navigation.toggleDrawer();
                Mixpanel.track('User Taps Side Drawer', {
                  info: `User taps side drawer on community search screen`,
                  'Activity Screen': 'Community Search Screen'
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
                {notificationData?.showConnectionNotificationBadge ? (
                  <MenuBadgeWrapper />
                ) : null}
              </Fragment>
            </TouchableHighlight>
          ),

          headerRight: () => (
            <GradientButton
              gradientContainerstyle={{
                width: RFValue(30),
                height: RFValue(30),
                marginBottom: RFValue(20)
              }}
              onPress={() => {
                navigation.navigate('NewMessageScreen');
                Mixpanel.track('User Taps Chat Icon', {
                  info: `User taps chat icon on community search screen`,
                  'Activity Screen': 'Community Search Screen'
                });
                logEvent('tap chat icon', { from: 'chat' });
              }}
              labelStyle={{ paddingLeft: 3 }}
            >
              <Feather name="message-square" color={colors.WHITE} size={20} />
            </GradientButton>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: { marginRight: 10 }
        }}
      />

      <CommunityStack.Screen
        name="CommunityDetailScreen"
        component={Screens.CommunityDetailScreen}
        options={({ route }) => ({
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
          },
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 0
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <CommunityStack.Screen
        name="MemberDetailScreen"
        component={Screens.MemberDetailScreen}
        options={({ route }) => ({
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
          },
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 0
          },
          headerRight: () => (
            <Menu
              visible={menu}
              onDismiss={showMenu}
              anchor={
                <TouchableRipple
                  rippleColor={colors.PRIMARY}
                  onPress={() => {}}
                  style={{
                    padding: RFValue(3),
                    paddingTop: RFValue(6),
                    paddingBottom: RFValue(6),
                    backgroundColor: menu ? colors.PRIMARY : 'transparent',
                    borderRadius: 4,
                    borderColor: menu ? colors.PRIMARY : colors.INACTIVE,
                    borderWidth: 1
                  }}
                >
                  <Entypo
                    name="dots-three-vertical"
                    color={menu ? colors.WHITE : colors.PRIMARY_TEXT}
                    size={20}
                  />
                </TouchableRipple>
              }
              contentStyle={{
                right: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingTop: 0,
                paddingBottom: 0,
                overflow: Platform.select({ android: 'hidden' })
              }}
              style={{ top: RFValue(getMenuHeight()) }}
            >
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.block`)}
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.RED,
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.report`)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.RED,
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.removeConnection`)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.copy`)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              />
            </Menu>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <CommunityStack.Screen
        name="CommunityAlgoliaScreen"
        component={Screens.AlgoliaScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          headerTitle: () => (
            <Image
              source={require('../../../assets/images/logo.png')}
              style={{
                width: RFValue(50),
                height: RFValue(50),
                resizeMode: 'contain'
              }}
            />
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 }
        }}
      />
    </CommunityStack.Navigator>
  );
}
