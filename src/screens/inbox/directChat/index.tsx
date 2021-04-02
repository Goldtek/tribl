import React, { useState, useEffect, useCallback } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import { Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  Paragraph,
  Surface,
  TouchableRipple,
  Menu,
  Divider
} from 'react-native-paper';
import { Ionicons, Entypo } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import {
  Chat,
  Avatar,
  Channel,
  MessageList,
  MessageInput
} from 'stream-chat-expo';
import hexToRGB from '../../../utils/hexToRGB';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import StreamInputBox from '../../../components/streamInputBox';
import CustomDirectMessage from '../../../components/customDirectMessage';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';
import { ChannelSort, LiteralStringForUnion } from 'stream-chat';
import { crashlytics } from '../../../firebase/config';
import { Channel as ChannelType } from 'stream-chat';
import CustomSystemMessage from '../../../components/customSystemMessage';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  chatClient,
  ThreadType,
  LocalUserType,
  LocalEventType,
  LocalChannelType,
  LocalMessageType,
  LocalReactionType,
  LocalAttachmentType
} from '../../../stream/types';

import {
  Container,
  HeaderContainer,
  GroupImageContainer,
  MessageListContainer,
  HeaderLeftCover,
  HeaderRightCover
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function DirectChatScreen(props: ScreenProp) {
  const { navigation, route } = props;
  const user = route.params;
  const { t } = useTranslation();
  const { bottom, top: safeAreaTop } = useSafeAreaInsets();
  const [text, setText] = useState('');
  const chatStyles = useStreamChatTheme();
  const { colors, fonts } = useThemeContext();
  const {
    setThread,
    setActivityScreen,
    setChannel: setStreamContextChannel
  } = useStreamContext();

  const [menu, setMenu] = useState(false);
  const showMenu = () => setMenu(!menu);

  const [channel, setChannel] = useState(
    chatClient.channel('team', user.channelId)
  );

  const [channelMembers, setChannelMembers] = useState(channel?.state.members);

  useEffect(() => {
    if (!user.channelId && user.id && !channel?.id) {
      getConversation();
    }

    setActivityScreen('directMessage');
    setStreamContextChannel(channel);
  }, [channel?.id]);

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

  const getConversation = async () => {
    const filter = {
      isDm: true,
      type: 'team',
      member_count: 2,
      members: { $eq: [user.id, `${chatClient.user?.id}`] }
    };

    const options = { presence: true, state: true, watch: true };
    const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

    try {
      const [channelExists] = await chatClient.queryChannels(
        filter,
        sort,
        options
      );

      if (channelExists) {
        setChannel(channelExists);
        setChannelMembers(channelExists.state.members);
      } else {
        createDmConversation();
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const createDmConversation = async () => {
    let newChannel: ChannelType<
      LocalAttachmentType,
      LocalChannelType,
      LiteralStringForUnion,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    >;

    try {
      if (!channel?.id) {
        // @ts-ignore
        newChannel = chatClient.channel('team', {
          conversationId: `${user.id}|${chatClient.user?.id}`,
          channelId: `${user.id}|${chatClient.user?.id}`,
          members: [user.id, `${chatClient.user?.id}`],
          messageRequest: { status: false },
          sender: {
            readAt: Date.now(),
            id: chatClient.user?.id,
            ...chatClient.user?.user
          },
          receiver: { ...user, readAt: Date.now() },
          name: Date.now(),
          community: {},
          isDm: true,
          isNew: true
        });

        await newChannel.create();
        setChannel(newChannel);
        setChannelMembers(newChannel.state.members);
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  let receiver: any = null;
  let receiverId: any = null;
  const groupAvatar: string[] = [];

  if (Boolean(channel.data?.isDm)) {
    receiverId = Object.keys(channelMembers).find(
      (userId: string) => userId !== chatClient.user?.id
    );
  }

  if (Boolean(channel.data?.isGroup)) {
    const members = Object.values(channel.state.members);

    for (let index = 0; index < members.length; index++) {
      const member = members[index];

      if (groupAvatar.length === 3) break;

      if (chatClient.user?.id !== member.user?.id) {
        const avatar = member.user?.user.avatar || USER_DEFAULT_AVATAR;
        groupAvatar.push(avatar);
      }

      if (members.length === 2 && groupAvatar.length < 2) {
        groupAvatar.push(`${chatClient.user?.user.avatar}`);
      }
    }
  }

  if (Boolean(channel.data?.isDm)) {
    receiver = receiverId
      ? channelMembers[`${receiverId}`].user
      : {
          image: route.params.avatar || USER_DEFAULT_AVATAR,
          name:
            route.params.title ||
            `${route.params.firstName} ${route.params.lastName}`
        };
  }

  if (Boolean(channel.data?.isGroup)) {
    receiver = channel.data;
  }

  const inviteTribeNavigation = () => {
    navigation.navigate('InviteToTribeFromProfileScreen', {
      memberId: user?.id
    });
    setMenu(false);
  };

  const inviteChannelNavigation = () => {
    navigation.navigate('InviteToChannelFromProfileScreen', {
      memberId: user?.id
    });
    setMenu(false);
  };

  useEffect(() => {
    tagScreenName('DirectChatScreen');
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container style={{ paddingBottom: bottom }}>
        <HeaderContainer>
          <HeaderLeftCover>
            <TouchableRipple
              onPress={() => {
                if (Boolean(channel.data?.isDm)) {
                  navigation.goBack();
                } else {
                  navigation.navigate('InboxScreen');
                }
              }}
              style={{
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 40 / 2,
                marginRight: 10
              }}
            >
              <Ionicons name="md-arrow-back" size={24} color={colors.PRIMARY} />
            </TouchableRipple>
            <Surface
              style={{
                width: 40,
                height: 40,
                elevation: 4,
                borderRadius: 40 / 2,
                marginRight: channel.data?.isGroup ? 10 : 5,
                justifyContent: 'center'
              }}
            >
              {Boolean(channel.data?.isDm) && (
                <Chat
                  //@ts-ignore
                  client={chatClient}
                  style={chatStyles}
                >
                  <Avatar
                    image={receiver?.image}
                    name={receiver?.name}
                    size={RFValue(40)}
                  />
                </Chat>
              )}

              {channel.data?.isGroup && groupAvatar.length === 2 && (
                <GroupImageContainer>
                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: groupAvatar[1],
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: RFValue(28),
                      height: RFValue(28),
                      borderRadius: RFValue(28 / 2),
                      zIndex: 2,
                      borderWidth: 2,
                      right: 1,
                      bottom: 1,
                      position: 'absolute',
                      borderColor: colors.WHITE
                    }}
                  />

                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: groupAvatar[0],
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: RFValue(25),
                      height: RFValue(25),
                      left: 1,
                      top: 5,
                      borderRadius: RFValue(25 / 2),
                      position: 'absolute',
                      borderColor: colors.WHITE,
                      borderWidth: 2
                    }}
                  />
                </GroupImageContainer>
              )}

              {channel.data?.isGroup && groupAvatar.length === 3 && (
                <GroupImageContainer>
                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: groupAvatar[0],
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: RFValue(22),
                      height: RFValue(22),
                      borderRadius: RFValue(22 / 2),
                      borderColor: colors.WHITE,
                      bottom: 5,
                      borderWidth: 2
                    }}
                  />

                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: groupAvatar[1],
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: RFValue(25),
                      height: RFValue(25),
                      borderRadius: RFValue(25 / 2),
                      top: 20,
                      zIndex: 2,
                      borderWidth: 2,
                      borderColor: colors.WHITE,
                      position: 'absolute'
                    }}
                  />

                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: groupAvatar[2],
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: RFValue(22),
                      height: RFValue(22),
                      bottom: 5,
                      borderWidth: 2,
                      borderColor: colors.WHITE,
                      borderRadius: RFValue(22 / 2)
                    }}
                  />
                </GroupImageContainer>
              )}
            </Surface>
            <Paragraph
              style={{
                fontSize: fonts.MEDIUM_SIZE + 2,
                fontFamily: fonts.WORK_SANS_BOLD,
                marginHorizontal: 5
              }}
            >
              {`${receiver?.name}`.length <= 20
                ? `${receiver?.name}`
                : `${receiver?.name}`.substr(0, 20).concat('...')}
            </Paragraph>
          </HeaderLeftCover>
          {Boolean(channel.data?.isDm) && (
            <HeaderRightCover>
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
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingTop: 0,
                  paddingBottom: 0,
                  overflow: Platform.select({ android: 'hidden' })
                }}
                style={{ top: RFValue(getMenuHeight()) }}
              >
                <Menu.Item
                  onPress={inviteTribeNavigation}
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
                  onPress={inviteChannelNavigation}
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
            </HeaderRightCover>
          )}
        </HeaderContainer>

        <Chat
          //@ts-ignore
          client={chatClient}
          style={chatStyles}
        >
          <Channel
            //@ts-ignore
            channel={channel}
            KeyboardCompatibleView={CustomKeyboardCompatibleView}
          >
            <MessageListContainer>
              <MessageList
                onThreadSelect={(thread) => {
                  setThread(thread as ThreadType);
                  setActivityScreen('directMessageThreadScreen');
                  navigation.navigate('ThreadChatScreen', {
                    channelId: thread?.id
                  });
                }}
                Message={CustomDirectMessage}
                //@ts-ignore
                MessageSystem={CustomSystemMessage}
              />
              <MessageInput
                Input={StreamInputBox}
                initialValue={text}
                onChangeText={(text) => setText(text)}
                additionalTextInputProps={{
                  placeholderTextColor: hexToRGB(colors.STATUS_BAR_COLOR, 0.7),
                  placeholder: 'Type your message here'
                }}
              />
            </MessageListContainer>
          </Channel>
        </Chat>
      </Container>
    </TouchableWithoutFeedback>
  );
}
