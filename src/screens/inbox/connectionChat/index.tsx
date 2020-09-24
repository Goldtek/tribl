import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Send, Avatar, Bubble } from 'react-native-gifted-chat';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../../theme';
import { MessageInterface } from '../types';
import Firechat from '../../../firebase';
import { NavigationInterface } from '../../types';
import {
  MARK_MESSAGE_READ,
  SEND_DIRECT_MESSAGE
} from '../../../graphql/server/mutations';
import {
  MyPassportInterface,
  UserPassportInterface
} from '../../../graphql/types';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import { fireAuth } from '../../../firebase/config';
import { DEVICE_OS } from '../../../utils/device';
import hexToRGB from '../../../utils/hexToRGB';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: { title: string; avatar: string; receiverId: string };
  };
}

export default function ConnectionChatScreen(props: ScreenProp) {
  const { receiverId, avatar } = props.route.params;

  const [chatId, setChatId] = useState<string | null>(null);

  const { colors, fonts } = useThemeContext();

  const userId = fireAuth.currentUser?.uid;

  const [sendMessage] = useMutation(SEND_DIRECT_MESSAGE);

  const [markConversationAsRead] = useMutation(MARK_MESSAGE_READ, {
    variables: { payload: { conversationId: chatId } }
  });

  const { data: receiverPassport, loading, refetch } = useQuery<
    UserPassportInterface
  >(GET_SINGLE_PASSPORT, { variables: { id: receiverId } });

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;
  const receiverDetails = receiverPassport?.singlePassport;

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    if (receiverDetails?.conversation && receiverDetails?.conversation.id) {
      setChatId(receiverDetails?.conversation.id);
    }
  }, [loading, receiverDetails?.conversation]);

  useEffect(() => {
    if (!chatId) return;

    const chatMessages = Firechat.getChatMessages(chatId);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((document, index) => {
          const message = document.data();

          if (snapshot.docs.length - 1 === index) {
            setImmediate(markConversationAsRead);
          }

          return {
            ...message,
            user: { _id: message.senderId, avatar },
            _id: document.id
          } as MessageInterface;
        });

        setMessages(conversations);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    const [message] = messages;
    sendMessage({
      variables: { payload: { receiverId, content: message.text } }
    });

    if (!receiverDetails?.conversation) refetch();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <GiftedChat
        placeholder="Start typing ..."
        messages={messages}
        user={{
          _id: userId as string,
          avatar: userDetails?.avatar,
          name: `${userDetails?.firstName} ${userDetails?.lastName}`
        }}
        alwaysShowSend={true}
        isLoadingEarlier={true}
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
              right: {}
            }}
          />
        )}
        renderBubble={(props) => (
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
        )}
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
