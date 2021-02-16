import React, { useState, useEffect } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Paragraph, Surface, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import hexToRGB from '../../../utils/hexToRGB';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { chatClient, ThreadType } from '../../../stream/types';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import StreamInputBox from '../../../components/streamInputBox';
import CustomDirectMessage from '../../../components/customDirectMessage';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';
import { ChannelSort } from 'stream-chat';
import { LocalChannelType } from '../../../stream/types';

import { HeaderContainer, Container, MessageListContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function DirectChatScreen(props: ScreenProp) {
  const { navigation, route } = props;

  const [text, setText] = useState('');
  const chatStyles = useStreamChatTheme();
  const { colors, fonts } = useThemeContext();
  const {
    setThread,
    setActivityScreen,
    channel: streamChannel,
    setChannel: setStreamContextChannel
  } = useStreamContext();

  const [channel, setChannel] = useState(
    chatClient.channel('team', route.params.channelId)
  );

  useEffect(() => {
    const getChannel = async () => {
      const filter = {
        type: 'team',
        id: route.params.channelId
      };

      const options = { presence: true, state: true, watch: true };

      const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

      const [queryChannel] = await chatClient.queryChannels(
        filter,
        sort,
        options
      );

      if (!queryChannel) return;

      setChannel(queryChannel);
    };

    getChannel();
  }, []);

  const receiver = [channel.data?.receiver, channel.data?.sender].find(
    (user) => user?.id !== chatClient.user?.id
  );

  const displayAvatar = {
    name: `${receiver?.firstName} ${receiver?.lastName}`,
    image: receiver?.avatar || USER_DEFAULT_AVATAR
  };

  useEffect(() => {
    tagScreenName('DirectChatScreen');
  }, []);

  useEffect(() => {
    if (streamChannel.id !== channel.id) {
      setStreamContextChannel(channel);
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
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
                uri: displayAvatar.image,
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
            {displayAvatar.name.length <= 20
              ? displayAvatar.name
              : `${displayAvatar.name.substr(0, 20)}...`}
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
