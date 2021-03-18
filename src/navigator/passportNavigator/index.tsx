import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import PassportScreen from '../../screens/passport/index';
import BirthplaceScreen from '../../screens/passport/birthplaceScreen';
import CitizenshipScreen from '../../screens/passport/widgets/citizenshipScreen';
import { GLOBAL_HEADER_STYLE } from '../../constants';

const PassportStack = createStackNavigator();

export default function PassportNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <PassportStack.Navigator headerMode="screen">
      <PassportStack.Screen
        name="PassportScreen"
        component={PassportScreen}
        options={{ headerShown: false }}
      />
      <PassportStack.Screen
        name="BirthPlaceScreen"
        component={BirthplaceScreen}
        options={{
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
      <PassportStack.Screen
        name="CitizenshipScreen"
        component={CitizenshipScreen}
        options={{
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        }}
      />
    </PassportStack.Navigator>
  );
}
