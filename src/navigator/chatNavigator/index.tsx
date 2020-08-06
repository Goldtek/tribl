import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/inbox';
import { Searchbar } from 'react-native-paper';
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
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const onChangeSearch = (query: any) => setSearch(query);

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
                height: RFValue(30)
              }}
              onPress={() => navigation.navigate('ChatScreen')}
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
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRight: () => (
            <Searchbar
              placeholder={t(`community.tabPanel.placeholder`)}
              onChange={onChangeSearch}
              value={search}
              style={{
                height: '70%',
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.SECONDARY_TEXT,
                elevation: 0,
                borderColor: colors.INACTIVE,
                borderRadius: 4,
                borderWidth: 1
              }}
              iconColor={colors.PRIMARY_TEXT}
            />
          ),
          headerRightContainerStyle: {
            width: '80%',
            marginRight: RFValue(10),
            marginLeft: RFValue(20)
          }
        }}
      />

      <ChatStack.Screen
        name="NewChatSearch"
        component={Screens.NewChatSearchScreen}
        options={{
          headerTitle: 'black lives matter',
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

      <ChatStack.Screen
        name="ChatScreen"
        component={Screens.ChatScreen}
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
