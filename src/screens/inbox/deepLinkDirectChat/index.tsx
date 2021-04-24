import React, { useState, useEffect, Fragment } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import {
  Paragraph,
  Surface,
  IconButton,
  TouchableRipple
} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Chat,
  Avatar,
  Channel,
  MessageList,
  MessageInput,
  DefaultCommandType,
  ChannelContextValue
} from 'stream-chat-expo';
import { StatusBar } from 'expo-status-bar';
import hexToRGB from '../../../utils/hexToRGB';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import StreamInputBox from '../../../components/streamInputBox';
import CustomDirectMessage from '../../../components/customDirectMessage';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';
import {
  ChannelSort,
  LiteralStringForUnion,
  Channel as StreamChatChannel
} from 'stream-chat';
import { crashlytics } from '../../../firebase/config';
import { Channel as ChannelType } from 'stream-chat';
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
  HeaderTitleContainer,
  HeaderContainer,
  MessageListContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function DeepLinkDirectChatScreen(props: ScreenProp) {
  const { navigation, route } = props;
  const user = route.params;
  const [text, setText] = useState('');
  const chatStyles = useStreamChatTheme();
  const { colors, fonts } = useThemeContext();

  const {
    setThread,
    setActivityScreen,
    setChannel: streamSetChannel
  } = useStreamContext();

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

  useEffect(() => {
    if (chatClient.user?.id && user.id) {
      getConversation();
    }
  }, [chatClient.user?.id]);

  useEffect(() => {
    setActivityScreen('directMessage');
    tagScreenName('DirectChatScreen');
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
        user.channelId ? { ...filter, id: { $in: [user.channelId] } } : filter,
        sort,
        options
      );

      if (channelExists) {
        setChannel(channelExists);
        setChannelMembers(channelExists?.state?.members);
        streamSetChannel(channelExists);
      } else {
        createDmConversation();
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
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
          name: Date.now(),
          community: {},
          isDm: true,
          isNew: true
        });

        await newChannel.watch();
        setChannel(newChannel);
        setChannelMembers(newChannel?.state?.members);
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const receiverId = Object.keys(channelMembers).find(
    (userId: string) => userId !== chatClient.user?.id
  );

  const receiver = receiverId
    ? channelMembers[`${receiverId}`].user
    : {
        image: route.params.avatar || USER_DEFAULT_AVATAR,
        name:
          route.params.title ||
          `${route.params.firstName} ${route.params.lastName}`
      };

  const goBack = () => {
    const canGoBack = navigation.canGoBack();
    return canGoBack
      ? navigation.goBack()
      : navigation.replace('CommunityScreen', { screen: 'InboxScreen' });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <StatusBar style="dark" animated />
        <HeaderContainer>
          <TouchableRipple
            onPress={goBack}
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
            <Surface
              style={{
                width: 40,
                height: 40,
                elevation: 4,
                borderRadius: 40 / 2,
                marginRight: channel.data?.isGroup ? 10 : 0,
                justifyContent: 'center'
              }}
            >
              <Chat
                //@ts-ignore
                client={chatClient}
                style={chatStyles}
              >
                <TouchableRipple
                  borderless
                  onPress={() =>
                    navigation.navigate('DirectMessageInformation')
                  }
                  style={{
                    height: RFValue(40),
                    width: RFValue(40),
                    borderRadius: 40 / 2
                  }}
                >
                  <Avatar
                    image={receiver?.image}
                    name={receiver?.name}
                    size={RFValue(40)}
                  />
                </TouchableRipple>
              </Chat>
            </Surface>
            <HeaderTitleContainer>
              <Paragraph
                numberOfLines={1}
                style={{
                  fontSize: fonts.MEDIUM_SIZE + 2,
                  fontFamily: fonts.WORK_SANS_BOLD,
                  marginHorizontal: 5
                }}
              >
                {receiver?.name}
              </Paragraph>
            </HeaderTitleContainer>

            {!Boolean(channel.data?.isNew) && (
              <IconButton
                icon={(iconProps) => (
                  <MaterialCommunityIcons {...iconProps} name="dots-vertical" />
                )}
                onPress={() => navigation.navigate('DirectMessageInformation')}
              />
            )}
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
                link_url: 'deep_link_direct_chats_screen'
              })
            }
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
                //@ts-ignore
                Message={CustomDirectMessage}
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
