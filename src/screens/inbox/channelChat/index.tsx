import React, { useState, useEffect, useCallback } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import {
  GiftedChat,
  Send,
  Avatar,
  Bubble,
  User,
  utils
} from 'react-native-gifted-chat';
import { Button, Paragraph, Text } from 'react-native-paper';
import {
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { MessageInterface } from '../types';
import { fireAuth } from '../../../firebase/config';
import Firechat from '../../../firebase';
import { MyPassportInterface } from '../../../graphql/types';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import { SEND_CHANNEL_MESSAGE } from '../../../graphql/server/mutations';
import { DEVICE_OS } from '../../../utils/device';
import hexToRGB from '../../../utils/hexToRGB';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function ChatScreen(props: ScreenProp) {
  const { navigation } = props;
  const { chatId } = props.route.params;
  const userId = fireAuth.currentUser?.uid as string;

  const { colors, fonts } = useThemeContext();

  const [sendMessage] = useMutation(SEND_CHANNEL_MESSAGE);

  const [userPassport] = useLazyQuery(GET_SINGLE_PASSPORT);

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const chatMessages = Firechat.getChannelMessages(chatId);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((document, index) => {
          const message = document.data();

          if (message.senderId !== userId) {
            userPassport({ variables: { id: message?.senderId } });
          }

          return {
            ...message,
            _id: document.id,
            user: {
              ...message.sender,
              _id: message?.senderId,
              name: `${message.sender?.firstName} ${message.sender?.lastName}`
            }
          } as MessageInterface;
        });

        setMessages(conversations);
      }
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));

    const [message] = messages;

    sendMessage({
      variables: { payload: { content: message.text, channelId: chatId } }
    });
  }, []);

  const handleNavigation = useCallback((user?: User) => {
    navigation.navigate('DrawerMemberDetailScreen', {
      title: `${user?.name}`,
      details: { ...user, id: `${user?._id}` }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <GiftedChat
        placeholder="Start typing ..."
        messages={messages}
        user={{
          _id: userId,
          avatar: userDetails?.avatar,
          name: `${userDetails?.firstName} ${userDetails?.lastName}`
        }}
        alwaysShowSend={true}
        showUserAvatar={true}
        renderAvatarOnTop={true}
        onPressAvatar={handleNavigation}
        onSend={onSend}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              width: RFValue(40),
              height: RFValue(40),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.PRIMARY,
              borderRadius: RFValue(40 / 2),
              marginRight: 10,
              marginVertical: 5
            }}
          >
            <Ionicons name="ios-send" color={colors.WHITE} size={RFValue(20)} />
          </Send>
        )}
        listViewProps={{
          showsVerticalScrollIndicator: false,
          style: { marginBottom: RFValue(15) }
        }}
        textInputProps={{
          style: {
            flex: 1,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_MEDIUM,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: Platform.select({ ios: RFValue(12) }),
            paddingBottom: Platform.select({ ios: RFValue(12) }),
            color: colors.PRIMARY_TEXT,
            borderRadius: 5,
            marginHorizontal: 10,
            marginVertical: 5,
            borderWidth: 1,
            borderColor: colors.INACTIVE
          }
        }}
        renderAvatar={(props) => (
          <Avatar
            {...props}
            imageStyle={{
              left: { marginRight: RFValue(-7), borderRadius: RFValue(40 / 2) },
              right: { marginLeft: RFValue(-7), borderRadius: RFValue(40 / 2) }
            }}
          />
        )}
        renderSystemMessage={(props) => {
          return (
            <Container>
              <Button
                onPress={() => handleNavigation(props.currentMessage?.user)}
                labelStyle={{
                  marginHorizontal: 5,
                  textTransform: 'capitalize'
                }}
              >
                {props.currentMessage?.user.name}
              </Button>
              <Paragraph>{props.currentMessage?.text}</Paragraph>
            </Container>
          );
        }}
        renderBubble={(props) => {
          if (!props.currentMessage) return;

          if (
            utils.isSameUser(props.currentMessage, props.previousMessage) &&
            utils.isSameDay(props.currentMessage, props.previousMessage)
          ) {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: colors.PRIMARY,
                    borderRadius: 7
                  },
                  left: {
                    backgroundColor: hexToRGB(colors.DISABLED, 0.7),
                    borderRadius: 7
                  }
                }}
              />
            );
          }

          return userId === props.currentMessage.user._id ? (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: colors.PRIMARY,
                  borderRadius: 7
                },
                left: {
                  backgroundColor: hexToRGB(colors.DISABLED, 0.7),
                  borderRadius: 7
                }
              }}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  paddingHorizontal: 10,
                  paddingVertical: 5
                }}
              >
                {props.currentMessage.user.name}
              </Text>

              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: colors.PRIMARY,
                    borderRadius: 7,
                    borderWidth: 1
                  },
                  left: {
                    backgroundColor: hexToRGB(colors.DISABLED, 0.7),
                    borderRadius: 7
                  }
                }}
              />
            </View>
          );
        }}
        isKeyboardInternallyHandled={true}
      />
      {DEVICE_OS === 'ios' && (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={RFValue(-170)}
        />
      )}
    </SafeAreaView>
  );
}
