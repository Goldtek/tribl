import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/community';
import { Entypo } from '@expo/vector-icons';
import {
  Menu,
  TouchableRipple,
  Divider,
  Searchbar,
  Text
} from 'react-native-paper';

const CommunityStack = createStackNavigator();

export default function CommunityNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { top: safeAreaTop } = useSafeAreaInsets();

  const [menu, setMenu] = useState({
    communityScreen: false,
    detailScreen: false
  });

  const [search, setSearch] = useState('');

  const onChangeSearch = (query: any) => setSearch(query);

  const showMenu = (screen: string) => () => {
    //@ts-ignore
    setMenu({ ...menu, [screen]: !menu[screen] });
  };

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
      screenOptions={{
        headerTitleStyle: {
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE * 1.2),
          color: colors.PRIMARY_TEXT,
          textTransform: 'capitalize'
        },
        headerStyle: { height: RFValue(90) }
      }}
    >
      <CommunityStack.Screen
        name="CommunityScreen"
        component={Screens.HomeScreen}
        options={{
          headerTitle: t(`community.headerTitle`),
          headerRightContainerStyle: { marginRight: 10 },
          headerRight: () => (
            <Menu
              visible={menu.communityScreen}
              onDismiss={showMenu('communityScreen')}
              anchor={
                <TouchableRipple
                  rippleColor={colors.PRIMARY}
                  onPress={showMenu('communityScreen')}
                  style={{
                    padding: RFValue(3),
                    paddingTop: RFValue(6),
                    paddingBottom: RFValue(6),
                    backgroundColor: menu.communityScreen
                      ? colors.PRIMARY
                      : 'transparent',
                    borderRadius: 4,
                    borderColor: menu.communityScreen
                      ? colors.PRIMARY
                      : colors.INACTIVE,
                    borderWidth: 1
                  }}
                >
                  <Entypo
                    name="dots-three-vertical"
                    color={
                      menu.communityScreen ? colors.WHITE : colors.PRIMARY_TEXT
                    }
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
                title="Invite Friend"
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
                  color: colors.PRIMARY_TEXT,
                  textAlign: 'center'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title="Connection Requests"
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
                  color: colors.PRIMARY_TEXT
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title="Privacy Settings"
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
                  color: colors.PRIMARY_TEXT
                }}
              />
            </Menu>
          )
        }}
      />

      <CommunityStack.Screen
        name="CommunitySearchScreen"
        component={Screens.SearchScreen}
        options={{
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRight: () => (
            <Searchbar
              placeholder="Search by name or tag"
              onChange={onChangeSearch}
              value={search}
              style={{
                height: '70%',
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.SECONDARY_TEXT,
                elevation: 0,
                borderColor: colors.INACTIVE,
                borderRadius: 4,
                borderWidth: 1
              }}
              iconColor={colors.PRIMARY_TEXT}
            />
          ),
          headerRightContainerStyle: {
            width: '80%',
            marginRight: RFValue(10),
            marginLeft: RFValue(20)
          }
        }}
      />

      <CommunityStack.Screen
        name="CommunityDetailScreen"
        component={Screens.CommunityDetailScreen}
        options={{
          headerTitle: () => (
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_BOLD,
                textTransform: 'capitalize'
              }}
            >
              black lives matter
            </Text>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { marginRight: 10 },
          headerRight: () => (
            <Menu
              visible={menu.detailScreen}
              onDismiss={showMenu('detailScreen')}
              anchor={
                <TouchableRipple
                  rippleColor={colors.PRIMARY}
                  onPress={showMenu('detailScreen')}
                  style={{
                    padding: RFValue(3),
                    paddingTop: RFValue(6),
                    paddingBottom: RFValue(6),
                    backgroundColor: menu.detailScreen
                      ? colors.PRIMARY
                      : 'transparent',
                    borderRadius: 4,
                    borderColor: menu.detailScreen
                      ? colors.PRIMARY
                      : colors.INACTIVE,
                    borderWidth: 1
                  }}
                >
                  <Entypo
                    name="dots-three-vertical"
                    color={
                      menu.detailScreen ? colors.WHITE : colors.PRIMARY_TEXT
                    }
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
                title="Invite Friend"
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
                  color: colors.PRIMARY_TEXT,
                  textAlign: 'center'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title="Connection Requests"
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
                  color: colors.PRIMARY_TEXT
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title="Privacy Settings"
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
                  color: colors.PRIMARY_TEXT
                }}
              />
            </Menu>
          )
        }}
      />
    </CommunityStack.Navigator>
  );
}
