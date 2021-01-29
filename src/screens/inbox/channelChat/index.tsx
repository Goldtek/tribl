import React, { useState, useEffect } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { useThemeContext } from '../../../theme';
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import hexToRGB from '../../../utils/hexToRGB';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { chatClient, ThreadType } from '../../../stream/types';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import StreamInputBox from '../../../components/streamInputBox';
import CustomMessage from '../../../components/customMessage';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function ChannelChatScreen(props: ScreenProp) {
  const { navigation } = props;

  const [text, setText] = useState('');
  const { channel, setThread, setActivityScreen } = useStreamContext();
  const chatStyles = useStreamChatTheme();
  const { colors } = useThemeContext();

  useEffect(() => {
    tagScreenName('ChannelChatScreen');
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
        <Chat
          //@ts-ignore
          client={chatClient}
          style={chatStyles}
        >
          <Channel
            //@ts-ignore
            channel={channel}
            //@ts-ignore
            Message={CustomMessage}
          >
            <MessageList
              onThreadSelect={(thread) => {
                setThread(thread as ThreadType);
                setActivityScreen('threadScreen');
                navigation.navigate('ThreadChatScreen');
              }}
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
          </Channel>
        </Chat>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
