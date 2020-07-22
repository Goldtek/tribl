import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Screens from '../../screens';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';

const CommunityStack = createStackNavigator();

export default function CommunityNavigator() {
  const { t } = useTranslation();
  const { fonts } = useThemeContext();

  return (
    <CommunityStack.Navigator
      initialRouteName="CommunityScreen"
      headerMode="screen"
      screenOptions={{
        headerTitleStyle: {
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE * 1.2),
          textTransform: 'capitalize'
        }
      }}
    >
      <CommunityStack.Screen
        name="CommunityScreen"
        component={Screens.CommunityScreen}
        options={{ headerTitle: t(`community.headerTitle`) }}
      />
    </CommunityStack.Navigator>
  );
}
