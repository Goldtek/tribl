import React, { useState, useCallback, Fragment } from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import { TouchableRipple, Menu, Divider, Text } from 'react-native-paper';
import { Image, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import ENVIRONMENT_VARIABLES from 'react-native-config';
import { useThemeContext } from '../../theme';
import InboxScreens from '../../screens/inbox';
//@ts-ignore
import { StreamApp } from 'expo-activity-feed';
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
import { DEVICE_OS } from '../../utils/device';
import BlockUserModal from '../../components/blockUser';
import ReportModal from '../../components/reportModal';
import {
  REJECT_CONNECTION,
  BLOCK_REPORT_USER
} from '../../graphql/server/mutations';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { logEvent } from '../../utils/uxcamHelper';
import { crashlytics } from '../../firebase/config';
import { UserPassportInterface } from '../../graphql/types';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { chatClient } from '../../stream/types';

const DrawerStack = createStackNavigator();

export default function DrawerStackNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);

  const [blockModalVisible, setBlockModalVisible] = useState(false);

  const showBlockModal = () => {
    setBlockModalVisible(!blockModalVisible);
    setMenu(false);
  };

  const [reportModalVisible, setReportModalVisible] = useState(false);

  const showReportModal = useCallback(
    (visible: boolean) => () => {
      setReportModalVisible(visible);
      setMenu(false);
      return true;
    },
    []
  );

  const [communityMenu, setCommunityMenu] = useState(false);
  const showCommunityMenu = () => setCommunityMenu(!communityMenu);

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

  const inviteNavigation = (id: string, name: string) => {
    navigation.navigate('InviteToTribeScreen', {
      communityId: id,
      communityName: name
    });
    setCommunityMenu(false);
  };

  const requestNavigation = (id: string) => {
    navigation.navigate('CommunityRequestScreen', {
      communityId: id
    });
    setCommunityMenu(false);
  };

  const ChannelRequestNavigation = (id: string) => {
    navigation.navigate('ChannelRequestScreen', {
      communityId: id
    });
    setCommunityMenu(false);
  };

  const [connectionLoading, setConnectionLoading] = useState(false);

  const [id, setID] = useState('');

  const [getUserPassport, { refetch }] = useLazyQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT,
    {
      variables: { id }
    }
  );

  const [declineConnection] = useMutation(REJECT_CONNECTION, {
    variables: {
      payload: { id: id }
    }
  });

  const handleRemoveConnection = async (id: string) => {
    setID(id);
    logEvent('remove connection', {
      from: 'Member Detail Screen'
    });
    setConnectionLoading(true);
    try {
      await declineConnection();
      setMenu(false);
      getUserPassport();
      refetch();
    } catch (error) {
      setConnectionLoading(false);
      crashlytics.recordError(new Error(error));
    }
  };

  const [block, setBlock] = useState(false);

  const getBlockedDetails = (details: boolean) => {
    setBlock(details);
  };

  enum status {
    UNBLOCK
  }

  const note = `${t(`community.memberPassport.unblock`)} `;

  const [unBlockUser, { loading: unblockLoading }] = useMutation(
    BLOCK_REPORT_USER,
    {
      variables: {
        payload: {
          passportId: id,
          status: status[0],
          notes: note
        }
      }
    }
  );

  const handleUnBlock = async (id: string) => {
    setID(id);
    try {
      await unBlockUser();
      setBlock(false);
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <DrawerStack.Screen
        name="ConnectionRequest"
        component={AccountScreens.ConnectionRequestScreen}
      />

      <DrawerStack.Screen
        name="MyConnections"
        component={AccountScreens.MyConnectionScreen}
      />

      <DrawerStack.Screen
        name="TribeRequestScreen"
        component={AccountScreens.TribeRequestScreen}
      />

      <DrawerStack.Screen name="MyNotifications">
        {(props) => (
          <StreamApp
            userId={chatClient.user?.id}
            token={chatClient.tokenManager.token}
            appId={ENVIRONMENT_VARIABLES.TRIBL_STREAM_APP_ID}
            apiKey={ENVIRONMENT_VARIABLES.TRIBL_STREAM_API_KEY}
            defaultUserData={{
              name: chatClient.user?.name,
              coverImage: chatClient.user?.image,
              profileImage: chatClient.user?.image
            }}
          >
            <AccountScreens.NotificationScreen {...props} />
          </StreamApp>
        )}
      </DrawerStack.Screen>

      <DrawerStack.Screen
        name="SelectGroupParticipantsScreen"
        component={InboxScreens.SelectGroupParticipantsScreen}
      />

      <DrawerStack.Screen
        name="AddMembersToGroupScreen"
        component={InboxScreens.AddMembersToGroupScreen}
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
        name="CreateChannelParticipant"
        component={InboxScreens.CreateChannelParticipant}
      />

      <DrawerStack.Screen
        name="DeepLinkDirectChatScreen"
        component={InboxScreens.DeepLinkDirectChatScreen}
      />

      <DrawerStack.Screen
        name="DeepLinkChannelChatScreen"
        component={InboxScreens.DeepLinkChannelChatScreen}
      />

      <DrawerStack.Screen
        name="ThreadChatScreen"
        component={InboxScreens.ThreadChatScreen}
        options={{
          headerShown: true,
          headerTitle: 'Thread',
          headerStyle: {
            height: RFValue(90)
          },
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
      />

      <DrawerStack.Screen
        name="ChannelInformationScreen"
        component={InboxScreens.ChannelInformationScreen}
      />

      <DrawerStack.Screen
        name="DirectMessageInformation"
        component={InboxScreens.DirectMessageInformation}
      />

      <DrawerStack.Screen
        name="GroupInformationScreen"
        component={InboxScreens.GroupInformationScreen}
      />

      <DrawerStack.Screen
        name="CreateChannelTribeScreen"
        component={InboxScreens.CreateChannelTribeScreen}
      />

      <DrawerStack.Screen
        name="CreateChannelNameScreen"
        component={InboxScreens.CreateChannelNameScreen}
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
        options={({ route }: any) => {
          setID(route?.params?.details.id);
          return {
            headerShown: true,
            headerTitle: () => null,
            headerTitleStyle: {
              borderWidth: 1,
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD
            },
            headerTitleContainerStyle: {
              flex: 1,
              paddingLeft: DEVICE_OS === 'ios' ? 30 : 0
            },
            headerRight: () => (
              <Fragment>
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
                    overflow: Platform.select({
                      android: 'hidden'
                    })
                  }}
                  style={{
                    top: RFValue(getMenuHeight())
                  }}
                >
                  <Menu.Item
                    onPress={
                      block
                        ? () => handleUnBlock(route?.params?.details.id)
                        : showBlockModal
                    }
                    title={
                      <Fragment>
                        {unblockLoading ? (
                          <ActivityIndicator
                            size="small"
                            color={colors.PRIMARY}
                            style={{
                              marginLeft: 'auto',
                              marginRight: RFValue(5)
                            }}
                          />
                        ) : null}
                        <Text style={{ textAlign: 'center' }}>
                          {block
                            ? t(`community.memberPassport.unblock`)
                            : t(`community.memberPassport.block`)}
                        </Text>
                      </Fragment>
                    }
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
                    onPress={showReportModal(true)}
                    title={t(`community.memberPassport.report`)}
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
                  {route?.params?.details?.connectionDetails?.status ===
                  'ACCEPTED' ? (
                    <Fragment>
                      <Divider />
                      <Menu.Item
                        onPress={() =>
                          handleRemoveConnection(route?.params?.details.id)
                        }
                        title={
                          <Fragment>
                            {connectionLoading ? (
                              <ActivityIndicator
                                size="small"
                                color={colors.RED}
                                style={{
                                  marginLeft: 'auto',
                                  marginRight: RFValue(5)
                                }}
                              />
                            ) : null}
                            <Text>
                              {t(`community.memberPassport.removeConnection`)}
                            </Text>
                          </Fragment>
                        }
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
                    </Fragment>
                  ) : null}

                  <Divider />

                  <Menu.Item
                    onPress={() =>
                      inviteTribeNavigation(route?.params?.details.id)
                    }
                    title={t(`community.invitation.inviteTribe`)}
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
                    title={t(`community.invitation.inviteChannel`)}
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
                <BlockUserModal
                  refetch={refetch}
                  data={route?.params}
                  blockModalVisible={blockModalVisible}
                  closeModal={showBlockModal}
                  getBlockedDetails={getBlockedDetails}
                />
                <ReportModal
                  data={route?.params}
                  closeReportModal={showReportModal(false)}
                  isVisible={reportModalVisible}
                />
              </Fragment>
            ),
            headerBackTitleVisible: false,
            headerTintColor: colors.PRIMARY,
            headerRightContainerStyle: {
              marginRight: 10
            },
            headerLeftContainerStyle: {
              paddingLeft: 10
            },
            headerStyle: GLOBAL_HEADER_STYLE
          };
        }}
      />

      <DrawerStack.Screen
        name="CommunityDetailScreen"
        component={CommunityDetailScreen}
        options={({ route }: any) => ({
          headerShown: true,
          headerTitle: route.params?.title,
          headerRight: () =>
            //@ts-ignore
            route?.params?.details?.isMember ? (
              <Menu
                visible={communityMenu}
                onDismiss={showCommunityMenu}
                anchor={
                  <TouchableRipple
                    rippleColor={colors.PRIMARY}
                    onPress={showCommunityMenu}
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
                  overflow: Platform.select({
                    android: 'hidden'
                  })
                }}
                style={{
                  top: RFValue(getMenuHeight())
                }}
              >
                <Menu.Item
                  //@ts-ignore
                  onPress={() =>
                    inviteNavigation(
                      //@ts-ignore
                      route.params?.details?.id,
                      //@ts-ignore
                      route.params?.title
                    )
                  }
                  title={t(`community.invitation.invite`)}
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
                {
                  //@ts-ignore
                  route?.params?.details?.isModerator &&
                  route?.params?.details?.isPrivate ? (
                    <Fragment>
                      <Divider />
                      <Menu.Item
                        onPress={() =>
                          //@ts-ignore
                          requestNavigation(route.params?.details?.id)
                        }
                        title={t(`community.recommended.communityRequests`)}
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
                    </Fragment>
                  ) : null
                }
                {
                  //@ts-ignore
                  route?.params?.details?.isModerator ? (
                    <Fragment>
                      <Divider />
                      <Menu.Item
                        onPress={() =>
                          //@ts-ignore
                          ChannelRequestNavigation(route.params?.details?.id)
                        }
                        title={t(`community.recommended.newChannelRequest`)}
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
                    </Fragment>
                  ) : null
                }
              </Menu>
            ) : null,
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
          headerRightContainerStyle: {
            marginRight: 10
          },
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
            headerStyle: {
              height: RFValue(90)
            },
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
        name="GroupMembersScreen"
        component={InboxScreens.GroupMembersScreen}
        options={(props) => {
          return {
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              height: RFValue(90)
            },
            headerTitleStyle: {
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            },
            headerTitle: 'group members',
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
          headerStyle: {
            height: RFValue(90)
          },
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
          headerStyle: {
            height: RFValue(90)
          },
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
          headerTitleContainerStyle: {
            alignItems: 'center'
          },
          headerLeftContainerStyle: {
            marginLeft: 5
          }
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
          headerRightContainerStyle: {
            marginRight: 10
          },
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
          headerRightContainerStyle: {
            marginRight: 10
          },
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
          headerRightContainerStyle: {
            marginRight: 10
          },
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
          headerRightContainerStyle: {
            marginRight: 10
          },
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
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />
    </DrawerStack.Navigator>
  );
}
