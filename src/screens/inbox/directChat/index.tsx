import React, { useState, useEffect, Fragment } from 'react';
import { NavigationInterface } from '../../types';
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
  MessageInput
} from 'stream-chat-expo';
import { StatusBar } from 'expo-status-bar';
import hexToRGB from '../../../utils/hexToRGB';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';
import useStreamChatTheme from '../../../utils/useStreamChatTheme';
import { useStreamContext } from '../../../stream';
import StreamInputBox from '../../../components/streamInputBox';
import CustomDirectMessage from '../../../components/customDirectMessage';
import CustomKeyboardCompatibleView from '../../../components/customKeyboardCompatibleView';
import { RFValue } from 'react-native-responsive-fontsize';
import { chatClient, ThreadType } from '../../../stream/types';
import { IFCMMessageTypes } from '../../../graphql/types';

import {
  Container,
  HeaderContainer,
  HeaderTitleContainer,
  MessageListContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DirectChatScreen(props: ScreenProp) {
  const { navigation } = props;
  const [text, setText] = useState('');
  const chatStyles = useStreamChatTheme();
  const { colors, fonts } = useThemeContext();
  const { channel, setThread, setActivityScreen } = useStreamContext();
  const receiverId = Object.keys(channel?.state?.members).find(
    (userId: string) => userId !== chatClient.user?.id
  );

  const receiver = channel?.state?.members[`${receiverId}`].user;

  useEffect(() => {
    tagScreenName('DirectChatScreen');
    setActivityScreen('directMessage');
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <StatusBar style="dark" animated />
        <HeaderContainer>
          <TouchableRipple
            onPress={() => navigation.goBack()}
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
                    navigation.navigate('DirectMessageInformation', {
                      details: { id: receiverId }
                    })
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

            <IconButton
              icon={(iconProps) => (
                <MaterialCommunityIcons {...iconProps} name="dots-vertical" />
              )}
              onPress={() =>
                navigation.navigate('DirectMessageInformation', {
                  details: { id: receiverId }
                })
              }
            />
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
                link_url: 'deep_link_direct_chats_screen',
                message_type: IFCMMessageTypes.DIRECT_MESSAGE_RECEIVED
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
