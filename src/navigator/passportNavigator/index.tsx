import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import PassportScreen from '../../screens/passport/index';
import BirthplaceScreen from '../../screens/passport/birthplaceScreen';
import { GLOBAL_HEADER_STYLE } from '../../constants';

const passportStack = createStackNavigator();

export default function PassportNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <passportStack.Navigator
      initialRouteName="PassportScreen"
      headerMode="screen"
    >
      <passportStack.Screen
        name="PassportScreen"
        component={PassportScreen}
        options={{ headerShown: false }}
      />
      <passportStack.Screen
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
    </passportStack.Navigator>
  );
}
