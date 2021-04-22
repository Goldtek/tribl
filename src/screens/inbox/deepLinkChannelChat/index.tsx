import React, { useState, Fragment, useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  DefaultCommandType,
  ChannelContextValue
} from 'stream-chat-expo';
import CustomChannelMessage from '../../../components/customChannelMessage';
import CustomSystemMessage from '../../../components/customSystemMessage';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { ChatScreenProps, NavigationInterface } from '../../types';
import StreamInputBox from '../../../components/streamInputBox';
import {
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType,
  ThreadType
} from '../../../stream/types';
import { logEvent, tagScreenName } from '../../../utils/uxcamHelper';
import {
  TouchableRipple,
  Paragraph,
  Surface,
  IconButton
} from 'react-native-paper';
import type { Channel as StreamChatChannel, ChannelSort } from 'stream-chat';
import { useMutation } from '@apollo/react-hooks';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useStreamContext } from '../../../stream';
import { useThemeContext } from '../../../theme';
import hexToRGB from '../../../utils/hexToRGB';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';
import { RFValue } from 'react-native-responsive-fontsize';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import { StatusBar } from 'expo-status-bar';
import FastImage from 'react-native-fast-image';
import { Mixpanel } from '../../../config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JOIN_COMMUNITY_CHANNEL } from '../../../graphql/server/mutations';
import { GET_COMMUNITY_CHANNELS } from '../../../graphql/server/query';
import { crashlytics } from '../../../firebase/config';

import {
  CountBadge,
  ChatContainer,
  HeaderContainer,
  MessageListContainer,
  HeaderTitleContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function DeepLinkChannelChatScreen(props: ScreenProp) {
  const { navigation, route } = props;
  const [text, setText] = useState('');
  const { bottom } = useSafeAreaInsets();
  const chatStyles = useStreamChatTheme();
  const { colors, fonts } = useThemeContext();

  const {
    setThread,
    setActivityScreen,
    setChannel: streamSetChannel
  } = useStreamContext();

  const [joinChannel] = useMutation(JOIN_COMMUNITY_CHANNEL);
  const [channel, setChannel] = useState<
    StreamChatChannel<
      LocalAttachmentType,
      LocalChannelType,
      DefaultCommandType,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    >
  >(
    {} as StreamChatChannel<
      LocalAttachmentType,
      LocalChannelType,
      DefaultCommandType,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    >
  );

  const [channelMembers, setChannelMembers] = useState<
    ChannelContextValue<
      LocalAttachmentType,
      LocalChannelType,
      DefaultCommandType,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    >['members']
  >(
    {} as ChannelContextValue<
      LocalAttachmentType,
      LocalChannelType,
      DefaultCommandType,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    >['members']
  );

  const getConversation = async () => {
    try {
      const filter = {
        id: { $in: [route.params.channelId] },
        members: { $in: [`${chatClient.user?.id}`] }
      };

      const options = { presence: true, state: true, watch: true };

      const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

      const [channelExists] = await chatClient.queryChannels(
        filter,
        sort,
        options
      );

      if (channelExists) {
        setChannel(channelExists);
        setChannelMembers(channelExists.state.members);
        streamSetChannel(channelExists);
      } else {
        addUserToChannel();
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  useEffect(() => {
    if (route.params.channelId && chatClient.user?.id) {
      getConversation();
    }
  }, [route.params.channelId, chatClient?.user?.id]);

  const members = Object?.values(channelMembers);

  const addUserToChannel = async () => {
    try {
      logEvent('join channel', { from: 'channel' });

      Mixpanel.track('User Joins Channel', {
        info: `User Joins ${channel.data?.name} Channel on ${channel.data?.community?.name} community`,
        'Activity Screen': 'Community Highlight Tribe Channels List'
      });

      await joinChannel({
        variables: { payload: { channelId: route.params.channelId } }
      });

      getConversation();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  useEffect(() => {
    tagScreenName('ChannelChatScreen');
    setActivityScreen('channelScreen');
  }, []);

  const handleChannelNavigation = () => {
    if (Boolean(channel.data?.isGroup)) {
      navigation.navigate('GroupInformationScreen');
    } else {
      navigation.navigate('ChannelInformationScreen');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ChatContainer style={{ paddingBottom: bottom }}>
        <StatusBar style="dark" animated />
        <HeaderContainer>
          <TouchableRipple
            onPress={() => {
              if (Boolean(route?.params?.newly_created_group)) {
                navigation.navigate('InboxScreen');
              } else {
                navigation.goBack();
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

          <Fragment>
            {members && members?.length === 1 ? (
              <TouchableRipple
                onPress={handleChannelNavigation}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
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
                        channelMembers[0]?.user?.image || USER_DEFAULT_AVATAR,
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
                      {Number(channel.data?.member_count)}
                    </Paragraph>
                  </CountBadge>
                </Surface>
              </TouchableRipple>
            ) : null}

            {members && members?.length >= 2 ? (
              <TouchableRipple
                onPress={handleChannelNavigation}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
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
                          members[members?.length - 2]?.user?.image ||
                          USER_DEFAULT_AVATAR,
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
                          members[members?.length - 1]?.user?.image ||
                          USER_DEFAULT_AVATAR,
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
                        {`${channel.data?.member_count}+`}
                      </Paragraph>
                    </CountBadge>
                  </Surface>
                </Fragment>
              </TouchableRipple>
            ) : null}

            <HeaderTitleContainer>
              <Paragraph
                numberOfLines={1}
                style={{
                  fontSize: fonts.MEDIUM_SIZE + 2,
                  fontFamily: fonts.WORK_SANS_BOLD,
                  marginLeft: 10
                }}
              >
                {route.params?.title}
              </Paragraph>
            </HeaderTitleContainer>
            <IconButton
              icon={(iconProps) => (
                <MaterialCommunityIcons {...iconProps} name="dots-vertical" />
              )}
              onPress={handleChannelNavigation}
            />
          </Fragment>
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
            doSendMessageRequest={(_cid, message) =>
              channel.sendMessage({
                ...message,
                link_url: 'deep_link_channel_chat_screen'
              })
            }
          >
            <MessageListContainer>
              <MessageList
                onThreadSelect={(thread) => {
                  setThread(thread as ThreadType);
                  setActivityScreen('channelThreadScreen');
                  navigation.navigate('ThreadChatScreen', {
                    channelId: thread?.id
                  });
                }}
                //@ts-ignore
                Message={CustomChannelMessage}
                //@ts-ignore
                MessageSystem={CustomSystemMessage}
              />
              <MessageInput
                initialValue={text}
                Input={StreamInputBox}
                onChangeText={(text) => setText(text)}
                additionalTextInputProps={{
                  placeholderTextColor: hexToRGB(colors.STATUS_BAR_COLOR, 0.7),
                  placeholder: 'Type your message here'
                }}
              />
            </MessageListContainer>
          </Channel>
        </Chat>
      </ChatContainer>
    </TouchableWithoutFeedback>
  );
}
