import React, { useState, useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomChannelMessage from '../../../components/customChannelMessage';
import CustomSystemMessage from '../../../components/customSystemMessage';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { ChatScreenProps, NavigationInterface } from '../../types';
import StreamInputBox from '../../../components/streamInputBox';
import { chatClient, ThreadType } from '../../../stream/types';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { useStreamContext } from '../../../stream';
import { useThemeContext } from '../../../theme';
import hexToRGB from '../../../utils/hexToRGB';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';

import { ChatContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function ChannelChatScreen(props: ScreenProp) {
  const { navigation, route } = props;
  const [text, setText] = useState('');
  const { colors } = useThemeContext();
  const { bottom } = useSafeAreaInsets();
  const chatStyles = useStreamChatTheme();
  const { setThread, setChannel, setActivityScreen } = useStreamContext();

  const channel = chatClient.channel('team', route.params.channelId);

  useEffect(() => {
    tagScreenName('ChannelChatScreen');
    setActivityScreen('channelScreen');
    setChannel(channel);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ChatContainer style={{ paddingBottom: bottom }}>
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
          </Channel>
        </Chat>
      </ChatContainer>
    </TouchableWithoutFeedback>
  );
}
