import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableRipple, Menu, Divider } from 'react-native-paper';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { Entypo } from '@expo/vector-icons';
import DrawerNavigator from './drawer';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { useThemeContext } from '../../theme';
import Screens from '../../screens/inbox';
import MemberDetailScreen from '../../screens/community/memberPassport';

const DrawerStack = createStackNavigator();

export default function DrawerStackNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);

  const { top: safeAreaTop } = useSafeAreaInsets();

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
    <DrawerStack.Navigator screenOptions={{ headerShown: false }}>
      <DrawerStack.Screen name="CommunityScreen" component={DrawerNavigator} />

      <DrawerStack.Screen
        name="DirectChatScreen"
        component={Screens.DirectChatScreen}
        options={({ route }) => ({
          headerShown: true,
          height: RFValue(90),
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerRight: () => (
            <TouchableRipple
              onPress={() => {}}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Entypo
                name="dots-three-vertical"
                color={colors.PRIMARY_TEXT}
                size={RFValue(17)}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 }
        })}
      />
      <DrawerStack.Screen
        name="ChannelChatScreen"
        component={Screens.ChannelChatScreen}
        options={({ route }) => ({
          headerShown: true,
          height: RFValue(90),
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerRight: () => (
            <TouchableRipple
              onPress={() => {}}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Entypo
                name="dots-three-vertical"
                color={colors.PRIMARY_TEXT}
                size={RFValue(17)}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 }
        })}
      />
      <DrawerStack.Screen
        name="ConnectionChatScreen"
        component={Screens.ConnectionChatScreen}
        options={({ route }) => ({
          headerShown: true,
          height: RFValue(90),
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerRight: () => (
            <TouchableRipple
              onPress={() => {}}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Entypo
                name="dots-three-vertical"
                color={colors.PRIMARY_TEXT}
                size={RFValue(17)}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 }
        })}
      />

      <DrawerStack.Screen
        name="MessageRequestScreen"
        component={Screens.MessageRequestScreen}
        options={({ route }) => ({
          headerShown: true,
          height: RFValue(90),
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerRight: () => (
            <TouchableRipple
              onPress={() => {}}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Entypo
                name="dots-three-vertical"
                color={colors.PRIMARY_TEXT}
                size={RFValue(17)}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 }
        })}
      />
      <DrawerStack.Screen
        name="DrawerMemberDetailScreen"
        component={MemberDetailScreen}
        options={({ route }) => ({
          headerShown: true,
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
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
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />
    </DrawerStack.Navigator>
  );
}
