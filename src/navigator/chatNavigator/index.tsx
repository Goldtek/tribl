import React, { Fragment } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { TouchableHighlight } from 'react-native';
import { Feather, Entypo } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/inbox';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import GradientButton from '../../components/gradientButton';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  ShowConnectionNotificationBadge,
  ShowSideMenu
} from '../../graphql/types';
import {
  GET_CONNECTION_NOTIFICATION_BADGE,
  GET_SIDE_MENU
} from '../../graphql/cache/query';
import { logEvent } from '../../utils/uxcamHelper';
import { Mixpanel } from '../../config';
import { TOGGLE_SIDE_MENU } from '../../graphql/cache/mutations';
import { MenuBadgeWrapper } from '../bottomNavigator/TabBar/styles';

const ChatStack = createStackNavigator();

interface ChatNavigatorProps extends NavigationInterface {}

export default function ChatNavigator(props: ChatNavigatorProps) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);

  const toggleMenu = () => {
    toggleSideMenu({ variables: { showSideMenu: !drawerData?.showSideMenu } });
  };

  return (
    <ChatStack.Navigator
      headerMode="screen"
      screenOptions={{ headerStyle: { height: RFValue(80) } }}
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
                toggleMenu();
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
                width: RFValue(25),
                height: RFValue(25),
                marginBottom: RFValue(20)
              }}
              onPress={() => {
                navigation.navigate('DrawerScreen', {
                  screen: 'NewMessageScreen'
                });
                Mixpanel.track('User Taps Chat Icon', {
                  info: `User taps chat icon on inbox screen`,
                  'Activity Screen': 'Inbox Screen'
                });
                logEvent('tap chat icon', { from: 'chat' });
              }}
              labelStyle={{ paddingLeft: 3 }}
            >
              <Entypo name="new-message" color={colors.WHITE} size={20} />
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
