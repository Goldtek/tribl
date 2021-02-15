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
import { chatClient, ThreadType } from '../../../stream/types';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import StreamInputBox from '../../../components/streamInputBox';
import CustomDirectMessage from '../../../components/customDirectMessage';
import CustomSystemMessage from '../../../components/customSystemMessage';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';

import { HeaderContainer, Container, MessageListContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function DirectChatScreen(props: ScreenProp) {
  const { navigation, route } = props;
  const { bottom } = useSafeAreaInsets();
  const [text, setText] = useState('');
  const chatStyles = useStreamChatTheme();
  const { colors, fonts } = useThemeContext();
  const { setThread, setActivityScreen } = useStreamContext();

  const channel = chatClient.channel('team', route.params.channelId);

  useEffect(() => {
    tagScreenName('DirectChatScreen');
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container style={{ marginBottom: bottom }}>
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
                uri: channel.data?.receiver.avatar,
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
            {route.params?.title.length <= 20
              ? route.params?.title
              : `${route.params?.title.substr(0, 20)}...`}
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
                //@ts-ignore
                MessageSystem={CustomSystemMessage}
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
