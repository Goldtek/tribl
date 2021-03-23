import React, { useState, useEffect } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Paragraph, Surface, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import {
  chatClient,
  ThreadType,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../stream/types';

import { HeaderContainer, Container, MessageListContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function DirectChatScreen(props: ScreenProp) {
  const { navigation, route } = props;

  const user = route.params;
  const [text, setText] = useState('');
  const { bottom } = useSafeAreaInsets();
  const chatStyles = useStreamChatTheme();
  const { colors, fonts } = useThemeContext();
  const {
    setThread,
    setActivityScreen,
    setChannel: setStreamContextChannel
  } = useStreamContext();

  const [channel, setChannel] = useState(
    chatClient.channel('team', user.channelId)
  );

  const [channelMembers, setChannelMembers] = useState(channel?.state.members);

  useEffect(() => {
    if (!user.channelId && user.id && !channel?.id) {
      getConversation();
    }

    setStreamContextChannel(channel);
  }, [channel?.id]);

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

  useEffect(() => {
    tagScreenName('DirectChatScreen');
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container style={{ paddingBottom: bottom }}>
        <HeaderContainer>
          <TouchableRipple
            onPress={navigation.goBack}
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
              justifyContent: 'center'
            }}
          >
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              source={{
                uri: receiver?.image,
                priority: FastImage.priority.high
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2
              }}
            />
          </Surface>
          <Paragraph
            style={{
              fontSize: fonts.MEDIUM_SIZE + 2,
              fontFamily: fonts.WORK_SANS_BOLD,
              marginHorizontal: 10
            }}
          >
            {`${receiver?.name}`.length <= 20
              ? `${receiver?.name}`
              : `${receiver?.name}`.substr(0, 20).concat('...')}
          </Paragraph>
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
