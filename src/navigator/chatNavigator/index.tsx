import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/inbox';
import { Feather } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import GradientButton from '../../components/gradientButton';

const ChatStack = createStackNavigator();

interface ChatNavigatorProps extends NavigationInterface {}

export default function ChatNavigator(props: ChatNavigatorProps) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

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
              <Feather
                name="menu"
                size={RFValue(25)}
                color={colors.PRIMARY_TEXT}
              />
            </TouchableHighlight>
          ),
          headerRight: () => (
            <GradientButton
              gradientContainerstyle={{
                width: RFValue(30),
                height: RFValue(30),
                marginBottom: RFValue(20)
              }}
              onPress={() => navigation.navigate('NewMessageScreen')}
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

      <ChatStack.Screen
        name="NewMessageScreen"
        component={Screens.NewMessageScreen}
        options={{
          headerTitle: t(`community.chat.chatTitle`),
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
    </ChatStack.Navigator>
  );
}
