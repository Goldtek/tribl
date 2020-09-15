import React, { useState, useEffect, useCallback } from 'react';
import { NavigationInterface } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { MessageInterface } from '../types';
import { fireAuth } from '../../../firebase/config';
import Firechat from '../../../firebase';
import { MyPassportInterface } from '../../../graphql/types';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import {
  MARK_MESSAGE_READ,
  SEND_DIRECT_MESSAGE
} from '../../../graphql/server/mutations';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DEVICE_OS } from '../../../utils/device';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: {
      title: string;
      avatar: string;
      chatId: string;
      receiverId: string;
    };
  };
}

export default function ChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const { chatId, receiverId } = props.route.params;

  const [sendMessage] = useMutation(SEND_DIRECT_MESSAGE);

  const [markConversationAsRead] = useMutation(MARK_MESSAGE_READ);

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const chatMessages = Firechat.getChatMessages(chatId);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((document) => {
          const message = document.data();
          return {
            ...message,
            user: { _id: message.senderId },
            _id: document.id
          } as MessageInterface;
        });

        setMessages(conversations);
        markConversationAsRead({
          variables: { payload: { conversationId: chatId } }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    const payloadMessages = messages.map((message) => {
      return sendMessage({
        variables: { payload: { receiverId, content: message.text } }
      });
    });

    await Promise.all(payloadMessages);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <GiftedChat
        placeholder="Start typing ..."
        messages={messages}
        user={{
          _id: userDetails?.id as string,
          avatar: userDetails?.avatar,
          name: `${userDetails?.firstName} ${userDetails?.lastName}`
        }}
        alwaysShowSend
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
        listViewProps={{ style: { marginBottom: RFValue(20) } }}
        textInputProps={{
          style: {
            flex: 1,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
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
        isKeyboardInternallyHandled={true}
        renderAvatar={() => null}
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
