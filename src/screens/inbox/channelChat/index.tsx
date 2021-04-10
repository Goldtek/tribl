import React, { useState, Fragment, useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import CustomChannelMessage from '../../../components/customChannelMessage';
import CustomSystemMessage from '../../../components/customSystemMessage';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { ChatScreenProps, NavigationInterface } from '../../types';
import StreamInputBox from '../../../components/streamInputBox';
import { useIsFocused } from '@react-navigation/core';
import {
  chatClient,
  LocalChannelType,
  ThreadType
} from '../../../stream/types';
import { logEvent, tagScreenName } from '../../../utils/uxcamHelper';
import {
  TouchableRipple,
  Paragraph,
  Surface,
  IconButton
} from 'react-native-paper';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useStreamContext } from '../../../stream';
import { useThemeContext } from '../../../theme';
import hexToRGB from '../../../utils/hexToRGB';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';
import { RFValue } from 'react-native-responsive-fontsize';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import { StatusBar } from 'expo-status-bar';
import FastImage from 'react-native-fast-image';
import { ChannelSort } from 'stream-chat';
import { Mixpanel } from '../../../config';
import { useTranslation } from 'react-i18next';
import {
  JOIN_COMMUNITY_CHANNEL,
  SEND_CHANNEL_MESSAGE
} from '../../../graphql/server/mutations';
import { GET_SINGLE_COMMUNITY } from '../../../graphql/server/query';

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

export default function ChannelChatScreen(props: ScreenProp) {
  const { navigation, route } = props;
  const isFocused = useIsFocused();
  const [text, setText] = useState('');
  const chatStyles = useStreamChatTheme();
  const { t } = useTranslation();
  const { colors, fonts } = useThemeContext();
  const {
    setThread,
    setActivityScreen,
    setChannel: setStreamChannel
  } = useStreamContext();

  const [sendMessage] = useMutation(SEND_CHANNEL_MESSAGE);
  const [joinChannel] = useMutation(JOIN_COMMUNITY_CHANNEL);
  const [getChannelCommunity] = useLazyQuery(GET_SINGLE_COMMUNITY);

  const [channel, setChannel] = useState(
    chatClient.channel('team', route.params.channelId)
  );

  const [channelMembers, setChannelMembers] = useState(
    Object.values(channel?.state?.members.asMutable())
  );

  const getConversation = async () => {
    const filter = { id: { $in: [route.params.channelId] } };

    const options = { presence: true, state: true, watch: true };

    const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

    const [channelExists] = await chatClient.queryChannels(
      filter,
      sort,
      options
    );

    if (!channelExists) return;

    await channelExists.watch();
    setChannel(channelExists);
    setChannelMembers(Object.values(channelExists?.state?.members.asMutable()));
  };

  useEffect(() => {
    if (isFocused && route.params.channelId && chatClient.user) {
      getConversation();
    }
  }, [isFocused, chatClient.user, route.params.channelId]);

  useEffect(() => {
    if (isFocused && channelMembers.length) {
      const user = channel?.state?.members[`${chatClient.user?.id}`];

      if (!user?.user?.id) {
        logEvent('join channel', { from: 'channel' });
        Mixpanel.track('User Joins Channel', {
          info: `User Joins ${channel.data?.name} Channel on ${channel.data?.community?.name} community`,
          'Activity Screen': 'Community Highlight Tribe Channels List'
        });

        joinChannel({
          variables: { payload: { channelId: route.params.channelId } }
        }).then(() => {
          getChannelCommunity({
            variables: { id: channel.data?.community?.id }
          });
          sendMessage({
            variables: {
              payload: {
                system: true,
                channelId: route.params.channelId,
                content: t(`community.chat.join`)
              }
            }
          });
          getConversation();
        });
      }
    }
  }, [isFocused, channel, channel?.state?.members, channelMembers]);

  useEffect(() => {
    tagScreenName('ChannelChatScreen');
    setActivityScreen('channelScreen');
    setStreamChannel(channel);
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
      <ChatContainer>
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
          <TouchableRipple
            onPress={handleChannelNavigation}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Fragment>
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
                      uri: channelMembers[0].user?.image || USER_DEFAULT_AVATAR,
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
                          channelMembers[channelMembers?.length - 2]?.user
                            ?.image || USER_DEFAULT_AVATAR,
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
                          channelMembers[channelMembers?.length - 1]?.user
                            ?.image || USER_DEFAULT_AVATAR,
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
          </TouchableRipple>
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
                link_url: 'channel_chat_screen'
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
