import React, { Fragment, useCallback, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableHighlight } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/inbox';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import GradientButton from '../../components/gradientButton';
import { MenuBadgeWrapper } from '../bottomNavigator/styles';
import { useQuery } from '@apollo/react-hooks';
import { ShowConnectionNotificationBadge } from '../../graphql/types';
import { GET_CONNECTION_NOTIFICATION_BADGE } from '../../graphql/cache/query';
import { logEvent } from '../../utils/uxcamHelper';
import { Mixpanel } from '../../config';

const ChatStack = createStackNavigator();

interface ChatNavigatorProps extends NavigationInterface {}

export default function ChatNavigator(props: ChatNavigatorProps) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);
  const { top: safeAreaTop } = useSafeAreaInsets();

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

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
    <ChatStack.Navigator
      initialRouteName="InboxScreen"
      headerMode="screen"
      screenOptions={{ headerStyle: { height: RFValue(90) } }}
    >
      <ChatStack.Screen
        name="InboxScreen"
        component={Screens.InboxScreen}
        options={{
          headerTitle: t(`community.chat.messageTitle`),
          headerLeft: (props) => (
            <TouchableHighlight
              {...props}
              onPress={() => {
                navigation.toggleDrawer();
                Mixpanel.track('User Taps Side Drawer', {
                  info: `User taps side drawer on inbox screen`,
                  'Activity Screen': 'Inbox Screen'
                });
                logEvent('open drawer', { from: 'community' });
              }}
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
          headerRight: () => (
            <GradientButton
              gradientContainerstyle={{
                width: RFValue(30),
                height: RFValue(30),
                marginBottom: RFValue(20)
              }}
              onPress={() => {
                navigation.navigate('NewMessageScreen');
                Mixpanel.track('User Taps Chat Icon', {
                  info: `User taps chat icon on inbox screen`,
                  'Activity Screen': 'Inbox Screen'
                });
                logEvent('tap chat icon', { from: 'chat' });
              }}
              labelStyle={{ paddingLeft: 3 }}
            >
              <Feather name="message-square" color={colors.WHITE} size={20} />
            </GradientButton>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerTitleStyle: {
            textTransform: 'uppercase',
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD
          }
        }}
      />
    </ChatStack.Navigator>
  );
}
