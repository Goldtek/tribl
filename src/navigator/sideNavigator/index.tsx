import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  TouchableRipple,
  Menu,
  Divider,
  Paragraph,
  Surface
} from 'react-native-paper';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DrawerNavigator from './drawer';
import { useQuery } from '@apollo/react-hooks';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { useThemeContext } from '../../theme';
import Screens from '../../screens/inbox';
import MemberDetailScreen from '../../screens/community/memberPassport';

const DrawerStack = createStackNavigator();

import { Container, CountBadge } from './styles';
import { MyPassportInterface } from '../../graphql/types';
import { GET_USER_PASSPORT } from '../../graphql/server/query';

export default function DrawerStackNavigator() {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

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

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

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
          headerLeft: () => (
            <TouchableRipple
              onPress={navigation.goBack}
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
                color={colors.PRIMARY}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY
        })}
      />

      <DrawerStack.Screen
        name="ChannelChatScreen"
        component={Screens.ChannelChatScreen}
        options={({ route }) => ({
          headerStyle: { height: RFValue(90) },
          headerShown: true,
          height: RFValue(90),
          headerTitle: () => null,
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
          headerLeft: () => (
            <Container>
              <TouchableRipple
                onPress={navigation.goBack}
                style={{
                  height: RFValue(40),
                  width: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: RFValue(40 / 2),
                  marginRight: 10
                }}
              >
                <Ionicons
                  name="md-arrow-back"
                  size={RFValue(24)}
                  color={colors.PRIMARY}
                />
              </TouchableRipple>

              <Surface
                style={{
                  width: RFValue(40),
                  height: RFValue(40),
                  elevation: 4,
                  borderRadius: 4
                }}
              >
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: userDetails?.avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: RFValue(40),
                    height: RFValue(40),
                    borderRadius: 4
                  }}
                />
              </Surface>

              <Surface
                style={{
                  width: RFValue(40),
                  height: RFValue(40),
                  justifyContent: 'center',
                  top: 1,
                  right: 10,
                  elevation: 4,
                  borderRadius: 4
                }}
              >
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: userDetails?.avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: RFValue(40),
                    height: RFValue(40),
                    borderRadius: 4
                  }}
                />
                <CountBadge style={{ elevation: 4 }}>
                  <Paragraph
                    style={{
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontWeight: 'bold',
                      color: colors.WHITE
                    }}
                  >
                    5+
                  </Paragraph>
                </CountBadge>
              </Surface>

              <Paragraph
                style={{
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontWeight: 'bold',
                  marginLeft: 10
                }}
              >
                {route.params?.title}
              </Paragraph>
            </Container>
          ),

          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY
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
          headerLeft: () => (
            <TouchableRipple
              onPress={navigation.goBack}
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
                color={colors.PRIMARY}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY
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
          headerLeft: () => (
            <TouchableRipple
              onPress={navigation.goBack}
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
                color={colors.PRIMARY}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY
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
          headerLeft: () => (
            <TouchableRipple
              onPress={navigation.goBack}
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
                color={colors.PRIMARY}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <DrawerStack.Screen
        name="NewMessageScreen"
        component={Screens.NewMessageScreen}
        options={{
          headerTitle: t(`community.chat.chatTitle`),
          headerStyle: GLOBAL_HEADER_STYLE
        }}
      />
    </DrawerStack.Navigator>
  );
}
