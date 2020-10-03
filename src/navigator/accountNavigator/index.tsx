import React, { useState, Fragment } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/account';
import { Feather } from '@expo/vector-icons';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { MenuBadgeWrapper } from '../bottomNavigator/styles';
import { useQuery } from '@apollo/react-hooks';
import { ShowConnectionNotificationBadge } from '../../graphql/types';
import { GET_CONNECTION_NOTIFICATION_BADGE } from '../../graphql/cache/query';

const accountStack = createStackNavigator();

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
    <accountStack.Navigator
      initialRouteName="AccountSettingScreen"
      headerMode="screen"
      screenOptions={{ headerStyle: { height: RFValue(90) } }}
    >
      <accountStack.Screen
        name="AccountSettingScreen"
        component={Screens.AccountSettingScreen}
        options={{
          //@ts-ignore
          headerTitle: t(`community.sideNav.settings`),
          headerLeft: (props) => (
            <TouchableHighlight
              {...props}
              onPress={navigation.toggleDrawer}
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
                {data?.showConnectionNotificationBadge ? (
                  <MenuBadgeWrapper />
                ) : null}
              </Fragment>
            </TouchableHighlight>
          ),
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
      <accountStack.Screen
        name="PrivacyScreen"
        component={Screens.PrivacyScreen}
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
    </accountStack.Navigator>
  );
}
