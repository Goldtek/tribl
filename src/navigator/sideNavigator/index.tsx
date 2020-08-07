import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import DrawerNavigator from './drawer';
import { useThemeContext } from '../../theme';

import Screens from '../../screens/inbox';

const DrawerStack = createStackNavigator();

export default function DrawerStackNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <DrawerStack.Navigator
      initialRouteName="CommunityScreen"
      screenOptions={{ headerShown: false }}
    >
      <DrawerStack.Screen name="CommunityScreen" component={DrawerNavigator} />

      <DrawerStack.Screen
        name="ChatScreen"
        component={Screens.ChatScreen}
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
    </DrawerStack.Navigator>
  );
}
