import React, { useState, useCallback, Fragment } from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import {
  TouchableRipple,
  Menu,
  Divider,
  Paragraph,
  Surface,
  Text
} from 'react-native-paper';
import { Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';
import { LEAVE_COMMUNITY_CHANNEL } from '../../graphql/server/mutations';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { useThemeContext } from '../../theme';
import InboxScreens from '../../screens/inbox';
import AccountScreens from '../../screens/account';
import CommunityScreens from '../../screens/community';
import MemberDetailScreen from '../../screens/community/memberPassport';
import InvitationScreen from '../../screens/community/invitationToTribe';
import InviteToTribeFromProfileScreen from '../../screens/community/inviteToTribeFromProfile';
import CreateNewTribeScreen from '../../screens/community/home/widget/createTribe';
import CommunityListScreen from '../../screens/passport/communityListScreen';
import UserConnectionListScreen from '../../screens/passport/userConnectionListScreen';
import CommunityDetailScreen from '../../screens/community/detail';
import AddAdminScreen from '../../screens/community/home/widget/addAdmin';
import TribeDetailScreen from '../../screens/community/home/widget/tribeDetails';
import getStreamChannelMembers from '../../utils/getStreamChannelMembers';
import { DEVICE_OS } from '../../utils/device';
import { useStreamContext } from '../../stream';

import { Container, CountBadge } from './styles';

const DrawerStack = createStackNavigator();

export default function DrawerStackNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { channel } = useStreamContext();
  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);
  const [channelMenu, setChannelMenu] = useState(false);
  const showChannelMenu = () => setChannelMenu(!channelMenu);
  const [leaveChannel] = useMutation(LEAVE_COMMUNITY_CHANNEL);

  const handleLeaveChannel = async () => {
    await leaveChannel({ variables: { payload: { channelId: channel.id } } });
    navigation.goBack();
  };

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

  const handleChannelMembersNavigation = () => {
    navigation.navigate('ChannelMembersScreen', { channelId: channel.id });
    setChannelMenu(false);
  };

  const handleChannelInformationNavigation = () => {
    navigation.navigate('ChannelInformationScreen', { channelId: channel.id });
    setChannelMenu(false);
  };

  const handleInviteToChannelNavigation = () => {
    navigation.navigate('InvitationToChannelScreen', { channelId: channel.id });
    setChannelMenu(false);
  };

  const inviteTribeNavigation = (id: string) => {
    navigation.navigate('InviteToTribeFromProfileScreen', {
      memberId: id
    });
    setMenu(false);
  };

  const inviteChannelNavigation = (id: string) => {
    navigation.navigate('InviteToChannelFromProfileScreen', {
      memberId: id
    });
    setMenu(false);
  };

  return (
    <DrawerStack.Navigator screenOptions={{ headerShown: false }}>
      <DrawerStack.Screen
        name="ConnectionRequest"
        component={AccountScreens.ConnectionRequestScreen}
      />

      <DrawerStack.Screen
        name="MyConnections"
        component={AccountScreens.MyConnectionScreen}
      />

      <DrawerStack.Screen
        name="MyNotifications"
        component={AccountScreens.NotificationScreen}
      />

      <DrawerStack.Screen
        name="GroupMessageScreen"
        component={InboxScreens.GroupMessageScreen}
      />

      <DrawerStack.Screen
        name="CreateGroupScreen"
        component={InboxScreens.CreateGroupScreen}
      />

      <DrawerStack.Screen
        name="DirectChatScreen"
        component={InboxScreens.DirectChatScreen}
      />

      <DrawerStack.Screen
        name="ThreadChatScreen"
        component={InboxScreens.ThreadChatScreen}
        options={{
          headerShown: true,
          headerTitle: 'Thread',
          headerStyle: { height: RFValue(90) },
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
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
        }}
      />

      <DrawerStack.Screen
        name="ChannelChatScreen"
        component={InboxScreens.ChannelChatScreen}
        options={({ route }: any) => {
          const channelMembers = getStreamChannelMembers(channel);

          return {
            headerStyle: { height: RFValue(90) },
            height: RFValue(90),
            headerShown: true,
            headerTitle: () => null,
            headerRight: () => (
              <Menu
                visible={channelMenu}
                onDismiss={showChannelMenu}
                anchor={
                  <TouchableRipple
                    rippleColor={colors.PRIMARY}
                    onPress={showChannelMenu}
                    style={{
                      padding: RFValue(3),
                      paddingTop: RFValue(6),
                      paddingBottom: RFValue(6),
                      backgroundColor: channelMenu
                        ? colors.PRIMARY
                        : 'transparent',
                      borderRadius: 4,
                      borderColor: channelMenu
                        ? colors.PRIMARY
                        : colors.INACTIVE,
                      borderWidth: 1,
                      marginRight: RFValue(10)
                    }}
                  >
                    <Entypo
                      name="dots-three-vertical"
                      color={channelMenu ? colors.WHITE : colors.PRIMARY_TEXT}
                      size={20}
                    />
                  </TouchableRipple>
                }
                contentStyle={{
                  top: 10,
                  right: 10,
                  paddingTop: 0,
                  paddingBottom: 0,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  overflow: Platform.select({ android: 'hidden' })
                }}
                style={{ top: RFValue(getMenuHeight()) }}
              >
                <Menu.Item
                  onPress={handleChannelMembersNavigation}
                  title={t(`community.chat.channelMembers`)}
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
                  onPress={handleInviteToChannelNavigation}
                  title={t(`community.chat.invite`)}
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
                  onPress={handleLeaveChannel}
                  title={t(`community.chat.leaveChannel`)}
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

                {channelMembers && channelMembers?.length === 1 ? (
                  <Surface
                    style={{
                      width: 40,
                      height: 40,
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
                        uri: channelMembers[0]?.avatar,
                        priority: FastImage.priority.high
                      }}
                      style={{
                        width: 40,
                        height: 40,
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
                        {channelMembers.length}
                      </Paragraph>
                    </CountBadge>
                  </Surface>
                ) : null}

                {channelMembers && channelMembers?.length >= 2 ? (
                  <Fragment>
                    <Surface
                      style={{
                        width: 40,
                        height: 40,
                        elevation: 4,
                        borderRadius: 4
                      }}
                    >
                      <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                          uri:
                            channelMembers[channelMembers?.length - 2]?.avatar,
                          priority: FastImage.priority.high
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 4,
                          borderColor: colors.PRIMARY,
                          borderWidth: 1
                        }}
                      />
                    </Surface>
                    <Surface
                      style={{
                        width: 40,
                        height: 40,
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
                          uri:
                            channelMembers[channelMembers?.length - 1]?.avatar,
                          priority: FastImage.priority.high
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 4,
                          borderColor: colors.PRIMARY,
                          borderWidth: 1
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
                          {`${channelMembers.length}+`}
                        </Paragraph>
                      </CountBadge>
                    </Surface>
                  </Fragment>
                ) : null}
                <TouchableRipple onPress={handleChannelInformationNavigation}>
                  <Paragraph
                    style={{
                      fontSize: fonts.MEDIUM_SIZE + 2,
                      fontFamily: fonts.WORK_SANS_BOLD,
                      marginLeft: 10
                    }}
                  >
                    {route.params?.title.length <= 20
                      ? route.params?.title
                      : `${route.params?.title.substr(0, 20)}...`}
                  </Paragraph>
                </TouchableRipple>
              </Container>
            ),
            headerBackTitleVisible: false,
            headerTintColor: colors.PRIMARY
          };
        }}
      />

      <DrawerStack.Screen
        name="ChannelInformationScreen"
        component={InboxScreens.ChannelInformationScreen}
        options={() => {
          return {
            headerShown: true,
            headerTitle: t(`community.chat.channelInformation`),
            headerRight: () => (
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: fonts.LARGE_SIZE,
                  color: colors.PRIMARY,
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.chat.edit`)}
              </Text>
            ),
            headerBackTitleVisible: false,
            headerTintColor: colors.PRIMARY,
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

            headerRightContainerStyle: { marginRight: 20 },
            headerStyle: GLOBAL_HEADER_STYLE
          };
        }}
      />

      <DrawerStack.Screen
        name="InvitationToChannelScreen"
        component={InboxScreens.InvitationToChannelScreen}
        options={() => {
          return {
            headerShown: true,
            headerTitle: () => null,
            headerRight: () => null,
            headerStyle: GLOBAL_HEADER_STYLE,
            headerBackTitleVisible: false,
            headerTintColor: colors.PRIMARY
          };
        }}
      />

      <DrawerStack.Screen
        name="InviteToChannelFromProfileScreen"
        component={InboxScreens.InviteToChannelFromProfileScreen}
        options={() => {
          return {
            headerShown: true,
            headerTitle: () => null,
            headerRight: () => null,
            headerStyle: GLOBAL_HEADER_STYLE,
            headerBackTitleVisible: false,
            headerTintColor: colors.PRIMARY
          };
        }}
      />

      {/* <DrawerStack.Screen
        name="ConnectionChatScreen"
        component={InboxScreens.ConnectionChatScreen}
        options={({ route }) => ({
          headerShown: true,
          height: RFValue(90),
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
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
      /> */}

      {/* <DrawerStack.Screen
        name="MessageRequestChatScreen"
        component={InboxScreens.MessageRequestChatScreen}
        options={({ route }: any) => ({
          headerShown: true,
          height: RFValue(90),
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
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
      /> */}

      <DrawerStack.Screen
        name="MemberDetailScreen"
        component={MemberDetailScreen}
        options={({ route }: any) => ({
          headerShown: true,
          headerTitle: () => null,
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
                  onPress={showMenu}
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
                onPress={() => inviteTribeNavigation(route?.params?.details.id)}
                title={t(`community.invitation.tribeInvite`)}
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
                  color: colors.PRIMARY_TEXT,
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
              />
              <Divider />
              <Menu.Item
                onPress={() =>
                  inviteChannelNavigation(route?.params?.details.id)
                }
                title={t(`community.invitation.channelTitle`)}
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
                  textAlign: 'center',
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
        name="CommunityDetailScreen"
        component={CommunityDetailScreen}
        options={({ route }: any) => ({
          headerShown: true,
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
          },
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 0
          },

          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <DrawerStack.Screen
        name="NewMessageScreen"
        component={InboxScreens.NewMessageScreen}
        options={{
          headerTitle: t(`community.chat.chatTitle`),
          headerStyle: GLOBAL_HEADER_STYLE
        }}
      />

      {/* <DrawerStack.Screen
        name="MessageRequestScreen"
        component={InboxScreens.MessageRequestScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerTitle: t(`community.chat.messageRequest`),
          headerLeft: () => (
            <TouchableRipple
              onPress={navigation.goBack}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Ionicons
                name="md-arrow-back"
                size={RFValue(24)}
                color={colors.PRIMARY_TEXT}
              />
            </TouchableRipple>
          )
        }}
      /> */}

      <DrawerStack.Screen
        name="ChannelMembersScreen"
        component={InboxScreens.ChannelMembersScreen}
        options={(props) => {
          return {
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: { height: RFValue(90) },
            headerTitleStyle: {
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            },
            headerTitle: 'channel members',
            headerTitleAlign: 'left',
            headerLeft: () => (
              <TouchableRipple
                onPress={() => props.navigation.goBack()}
                style={{
                  height: RFValue(40),
                  width: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: RFValue(40 / 2)
                }}
              >
                <Ionicons
                  name="md-arrow-back"
                  size={RFValue(24)}
                  color={colors.PRIMARY}
                />
              </TouchableRipple>
            )
          };
        }}
      />

      <DrawerStack.Screen
        name="CommunityListScreen"
        component={CommunityListScreen}
        options={({ route }: any) => ({
          ...TransitionPresets.ModalTransition,
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitle: route.params.title,
          headerBackTitleVisible: false,
          headerStyle: { height: RFValue(90) },
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
          },
          headerLeft: () => (
            <TouchableRipple
              onPress={navigation.goBack}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Ionicons
                name="md-arrow-back"
                size={RFValue(24)}
                color={colors.PRIMARY}
              />
            </TouchableRipple>
          )
        })}
      />

      <DrawerStack.Screen
        name="UserConnectionListScreen"
        component={UserConnectionListScreen}
        options={({ route }: any) => ({
          ...TransitionPresets.ModalTransition,
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitle: route.params.title,
          headerBackTitleVisible: false,
          headerStyle: { height: RFValue(90) },
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
          },
          headerLeft: () => (
            <TouchableRipple
              onPress={navigation.goBack}
              style={{
                height: RFValue(40),
                width: RFValue(40),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RFValue(40 / 2)
              }}
            >
              <Ionicons
                name="md-arrow-back"
                size={RFValue(24)}
                color={colors.PRIMARY}
              />
            </TouchableRipple>
          )
        })}
      />

      <DrawerStack.Screen
        name="CommunityAlgoliaScreen"
        component={CommunityScreens.AlgoliaScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          headerShown: true,
          headerTitle: () => (
            <Image
              source={require('../../../assets/images/logo.png')}
              style={{
                width: RFValue(50),
                height: RFValue(50),
                resizeMode: 'contain'
              }}
            />
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 }
        }}
      />

      <DrawerStack.Screen
        name="InviteToTribeScreen"
        component={InvitationScreen}
        options={() => ({
          headerShown: true,
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <DrawerStack.Screen
        name="InviteToTribeFromProfileScreen"
        component={InviteToTribeFromProfileScreen}
        options={() => ({
          headerShown: true,
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <DrawerStack.Screen
        name="CreateTribeScreen"
        component={CreateNewTribeScreen}
        options={() => ({
          headerShown: true,
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <DrawerStack.Screen
        name="AddAdminScreen"
        component={AddAdminScreen}
        options={() => ({
          headerShown: true,
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <DrawerStack.Screen
        name="TribeDetailScreen"
        component={TribeDetailScreen}
        options={() => ({
          headerShown: true,
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />
    </DrawerStack.Navigator>
  );
}
