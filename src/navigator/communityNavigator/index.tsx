import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Menu, TouchableRipple, Divider } from 'react-native-paper';
import Screens from '../../screens/community';
import { Entypo } from '@expo/vector-icons';
import { Platform } from 'react-native';

const CommunityStack = createStackNavigator();

export default function CommunityNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { top: safeAreaTop } = useSafeAreaInsets();

  const [menu, setMenu] = useState(false);

  const showMenu = () => setMenu(!menu);

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
        }
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
              visible={menu}
              onDismiss={showMenu}
              anchor={
                <TouchableRipple
                  rippleColor={colors.PRIMARY}
                  onPress={showMenu}
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
      />
    </CommunityStack.Navigator>
  );
}
