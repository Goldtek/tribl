import React, { useState, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { Chat, Channel, Thread, MessageInput } from 'stream-chat-expo';
import hexToRGB from '../../../utils/hexToRGB';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { chatClient } from '../../../stream/types';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import { useHeaderHeight } from '@react-navigation/stack';
import StreamInputBox from '../../../components/streamInputBox';

import { ChartContainer, Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function ThreadChatScreen(props: ScreenProp) {
  const { colors } = useThemeContext();
  const [text, setText] = useState('');
  const { thread, channel } = useStreamContext();
  const chatStyles = useStreamChatTheme();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    tagScreenName('ChannelChatScreen');
  }, []);

  //     Mixpanel.track('User Sends Thread Message', {
  //       info: `User sends message on ${channel?.name} channel in ${channel?.community} community`,
  //       'Activity Screen': 'Thread Message Screen'
  //     });

  return (
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
          keyboardVerticalOffset={headerHeight}
        >
          <ChartContainer>
            <Thread
              //@ts-ignore
              thread={thread}
              MessageInput={() => null}
            />
            <MessageInput
              Input={StreamInputBox}
              initialValue={text}
              onChangeText={(text) => setText(text)}
              additionalTextInputProps={{
                placeholderTextColor: hexToRGB(colors.STATUS_BAR_COLOR, 0.7),
                placeholder: 'Reply message here'
              }}
              parent_id={thread?.id}
            />
          </ChartContainer>
        </Channel>
      </Chat>
    </Container>
  );
}

export default React.memo(ThreadChatScreen);
