import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  TouchableRipple,
  Menu,
  Divider,
  Paragraph,
  Surface
} from 'react-native-paper';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DrawerNavigator from './drawer';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { useThemeContext } from '../../theme';
import Screens from '../../screens/inbox';
import Firechat from '../../firebase';
import MemberDetailScreen from '../../screens/community/memberPassport';
import { DEVICE_OS } from '../../utils/device';

const DrawerStack = createStackNavigator();

import { Container, CountBadge } from './styles';

type ParticipantType = {
  avatar: string;
  createdAt: Date;
};

export default function DrawerStackNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);

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

  useEffect(() => {
    if (!chatId) return;

    const channelParticipants = Firechat.getChannelParticipants(chatId);

    const unsubscribe = channelParticipants.onSnapshot({
      next: (snapshot) => {
        const participants = snapshot.docs.map((doc) => doc.data());
        setParticipants(participants as ParticipantType[]);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  return (
    <DrawerStack.Navigator screenOptions={{ headerShown: false }}>
      <DrawerStack.Screen name="CommunityScreen" component={DrawerNavigator} />

      <DrawerStack.Screen
        name="DirectChatScreen"
        component={Screens.DirectChatScreen}
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
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 0
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
                color={colors.DISABLED}
                size={RFValue(17)}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY
        })}
      />

      <DrawerStack.Screen
        name="ChannelChatScreen"
        component={Screens.ChannelChatScreen}
        options={({ route }: any) => {
          // @ts-ignore
          setChatId(route.params?.chatId);
          return {
            headerStyle: { height: RFValue(90) },
            headerShown: true,
            height: RFValue(90),
            headerTitle: () => null,
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
                  color={colors.DISABLED}
                  size={RFValue(17)}
                />
              </TouchableRipple>
            ),
            headerLeft: () => (
              <Container>
                <TouchableRipple
                  onPress={navigation.goBack}
                  style={{
                    height: RFValue(40),
                    width: RFValue(40),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: RFValue(40 / 2),
                    marginRight: 10
                  }}
                >
                  <Ionicons
                    name="md-arrow-back"
                    size={RFValue(24)}
                    color={colors.PRIMARY}
                  />
                </TouchableRipple>

                {participants.length === 1 ? (
                  <Surface
                    style={{
                      width: RFValue(40),
                      height: RFValue(40),
                      justifyContent: 'center',
                      top: 1,
                      right: 10,
                      elevation: 4,
                      borderRadius: 4
                    }}
                  >
                    <FastImage
                      resizeMode={FastImage.resizeMode.cover}
                      source={{
                        uri: participants[0]?.avatar,
                        priority: FastImage.priority.high
                      }}
                      style={{
                        width: RFValue(40),
                        height: RFValue(40),
                        borderRadius: 4
                      }}
                    />
                    <CountBadge style={{ elevation: 4 }}>
                      <Paragraph
                        style={{
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          fontFamily: fonts.WORK_SANS_REGULAR,
                          fontWeight: 'bold',
                          color: colors.WHITE
                        }}
                      >
                        {participants.length}
                      </Paragraph>
                    </CountBadge>
                  </Surface>
                ) : null}

                {participants.length >= 2 ? (
                  <Fragment>
                    <Surface
                      style={{
                        width: RFValue(40),
                        height: RFValue(40),
                        elevation: 4,
                        borderRadius: 4
                      }}
                    >
                      <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                          uri: participants[participants.length - 2]?.avatar,
                          priority: FastImage.priority.high
                        }}
                        style={{
                          width: RFValue(40),
                          height: RFValue(40),
                          borderRadius: 4
                        }}
                      />
                    </Surface>

                    <Surface
                      style={{
                        width: RFValue(40),
                        height: RFValue(40),
                        justifyContent: 'center',
                        top: 1,
                        right: 10,
                        elevation: 4,
                        borderRadius: 4
                      }}
                    >
                      <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                          uri: participants[participants.length - 1]?.avatar,
                          priority: FastImage.priority.high
                        }}
                        style={{
                          width: RFValue(40),
                          height: RFValue(40),
                          borderRadius: 4
                        }}
                      />
                      <CountBadge style={{ elevation: 4 }}>
                        <Paragraph
                          style={{
                            fontSize: RFValue(fonts.MEDIUM_SIZE),
                            fontFamily: fonts.WORK_SANS_REGULAR,
                            fontWeight: 'bold',
                            color: colors.WHITE
                          }}
                        >
                          {`${participants.length}+`}
                        </Paragraph>
                      </CountBadge>
                    </Surface>
                  </Fragment>
                ) : null}

                <Paragraph
                  style={{
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontWeight: 'bold',
                    marginLeft: 10
                  }}
                >
                  {route.params?.title}
                </Paragraph>
              </Container>
            ),
            headerBackTitleVisible: false,
            headerTintColor: colors.PRIMARY
          };
        }}
      />
      <DrawerStack.Screen
        name="ConnectionChatScreen"
        component={Screens.ConnectionChatScreen}
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
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 0
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
                color={colors.DISABLED}
                size={RFValue(17)}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY
        })}
      />

      <DrawerStack.Screen
        name="MessageRequestChatScreen"
        component={Screens.MessageRequestChatScreen}
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
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 0
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
                color={colors.DISABLED}
                size={RFValue(17)}
              />
            </TouchableRipple>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY
        })}
      />

      <DrawerStack.Screen
        name="MemberDetailScreen"
        component={MemberDetailScreen}
        options={({ route }) => ({
          headerShown: true,
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 30 : 0
          },
          headerRight: () => (
            <Menu
              visible={menu}
              onDismiss={showMenu}
              anchor={
                <TouchableRipple
                  rippleColor={colors.PRIMARY}
                  onPress={() => {}}
                  style={{
                    padding: RFValue(3),
                    paddingTop: RFValue(6),
                    paddingBottom: RFValue(6),
                    backgroundColor: menu ? colors.PRIMARY : 'transparent',
                    borderRadius: 4,
                    borderColor: menu ? colors.PRIMARY : colors.INACTIVE,
                    borderWidth: 1
                  }}
                >
                  <Entypo
                    name="dots-three-vertical"
                    color={menu ? colors.WHITE : colors.PRIMARY_TEXT}
                    size={20}
                  />
                </TouchableRipple>
              }
              contentStyle={{
                right: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingTop: 0,
                paddingBottom: 0,
                overflow: Platform.select({ android: 'hidden' })
              }}
              style={{ top: RFValue(getMenuHeight()) }}
            >
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.block`)}
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.RED,
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.report`)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.RED,
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.removeConnection`)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() => {}}
                title={t(`community.memberPassport.copy`)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
                titleStyle={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              />
            </Menu>
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <DrawerStack.Screen
        name="NewMessageScreen"
        component={Screens.NewMessageScreen}
        options={{
          headerTitle: t(`community.chat.chatTitle`),
          headerStyle: GLOBAL_HEADER_STYLE
        }}
      />

      <DrawerStack.Screen
        name="MessageRequestScreen"
        component={Screens.MessageRequestScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerTitle: t(`community.chat.messageRequest`),
          headerBackImage: () => (
            <Ionicons
              name="md-arrow-back"
              size={RFValue(24)}
              color={colors.PRIMARY_TEXT}
            />
          )
        }}
      />
    </DrawerStack.Navigator>
  );
}
