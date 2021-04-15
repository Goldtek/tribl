import React, { useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Chat, Channel, Thread } from 'stream-chat-expo';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import StreamInputBox from '../../../components/streamInputBox';
import { tagScreenName } from '../../../utils/uxcamHelper';
import CustomMessage from '../../../components/customChannelMessage';
import { chatClient } from '../../../stream/types';
import { useStreamContext } from '../../../stream';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import hexToRGB from '../../../utils/hexToRGB';

import { ChartContainer, Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function ThreadChatScreen(props: ScreenProp) {
  const { colors } = useThemeContext();
  const { thread, channel } = useStreamContext();
  const chatStyles = useStreamChatTheme();

  useEffect(() => {
    tagScreenName('ThreadChatScreen');
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Chat
          //@ts-ignore
          client={chatClient}
          style={chatStyles}
        >
          <Channel
            //@ts-ignore
            channel={channel}
            thread={thread}
            //@ts-ignore
            Message={CustomMessage}
          >
            <ChartContainer>
              <Thread
                //@ts-ignore
                thread={thread}
                additionalMessageInputProps={{
                  Input: (props) => <StreamInputBox {...props} />,
                  additionalTextInputProps: {
                    placeholderTextColor: hexToRGB(
                      colors.STATUS_BAR_COLOR,
                      0.7
                    ),
                    placeholder: 'Reply message here'
                  }
                }}
              />
            </ChartContainer>
          </Channel>
        </Chat>
      </Container>
    </TouchableWithoutFeedback>
  );
}

export default React.memo(ThreadChatScreen);
