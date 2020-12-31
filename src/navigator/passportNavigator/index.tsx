import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/account';
import PassportScreen from '../../screens/passport/index';
import BirthplaceScreen from '../../screens/passport/widgets/birthplaceScreen';
import ConnectionListScren from '../../screens/passport/widgets/connectionListScreen';
import CommunityListScren from '../../screens/passport/widgets/communityListScreen';
import { Feather } from '@expo/vector-icons';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { MenuBadgeWrapper } from '../bottomNavigator/styles';
import { useQuery } from '@apollo/react-hooks';
import { ShowConnectionNotificationBadge } from '../../graphql/types';
import { GET_CONNECTION_NOTIFICATION_BADGE } from '../../graphql/cache/query';

const passportStack = createStackNavigator();

interface AccountNavigatorProps extends NavigationInterface {}

export default function AccountNavigator(props: AccountNavigatorProps) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

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
        name="ConnectionListScreen"
        component={ConnectionListScren}
        options={{
          //@ts-ignore
          headerTitle: t(`community.sideNav.connection`),
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
      <passportStack.Screen
        name="BirthPlaceScreen"
        component={BirthplaceScreen}
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
      <passportStack.Screen
        name="CommunityListScreen"
        component={CommunityListScren}
        options={{
          //@ts-ignore
          headerTitle: t(`community.memberPassport.myTribes`),
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
