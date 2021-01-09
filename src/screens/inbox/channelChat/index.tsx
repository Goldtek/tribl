import React, { useState, useEffect } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import { SafeAreaView, View } from 'react-native';
import { useThemeContext } from '../../../theme';
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import hexToRGB from '../../../utils/hexToRGB';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { chatClient } from '../../../stream/types';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import { useHeaderHeight } from '@react-navigation/stack';
import StreamInputBox from '../../../components/streamInputBox';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function ChannelChatScreen(props: ScreenProp) {
  const { navigation } = props;

  const [text, setText] = useState('');
  const { channel, setThread } = useStreamContext();
  const chatStyles = useStreamChatTheme();
  const { colors } = useThemeContext();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    tagScreenName('ChannelChatScreen');
  }, []);

  //     Mixpanel.track('User Sends Channel Message', {
  //       info: `User sends message on ${channel?.name} channel in ${channel?.community} community`,
  //       'Activity Screen': 'Channel Message Screen'
  //     });
  // );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Chat
        //@ts-ignore
        client={chatClient}
        style={chatStyles}
      >
        <Channel
          //@ts-ignore
          channel={channel}
          keyboardVerticalOffset={headerHeight}
        >
          <View style={{ flex: 1 }}>
            <MessageList
              onThreadSelect={(thread) => {
                setThread(thread);
                navigation.navigate('ThreadChatScreen', {
                  channelId: channel.id
                });
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
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  );
}
