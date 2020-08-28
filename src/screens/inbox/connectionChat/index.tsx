import React, { useState, useEffect, useCallback } from 'react';
import { NavigationInterface } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import uniquePushId from 'unique-push-id';
import { useThemeContext } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { MessageInterface } from '../types';
import { fireAuth } from '../../../firebase/config';
import Firechat from '../../../firebase';
import { MyPassportInterface } from '../../../graphql/types';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { useQuery } from '@apollo/react-hooks';
import { ROOM_TYPES } from '../../../firebase/types';
import { CONVERSATION_TYPES } from '../../../firebase/types';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: { title: string; avatar: string; receiverId: string };
  };
}

export default function ConnectionChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const userId = fireAuth.currentUser?.uid as string;
  const chatId = uniquePushId();

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const [firstTime, setFirstTime] = useState(true);

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    const chatMessages = Firechat.getChatMessages(chatId);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((documentSnapshot) => {
          return documentSnapshot.data() as MessageInterface;
        });

        setMessages(GiftedChat.append(messages, conversations));
      }
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    const [message] = messages;

    if (firstTime) {
      setFirstTime(false);

      setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));

      await Firechat.createRoom(chatId, {
        message: message,
        name: props.route.params.title,
        receivers: [
          { ...props.route.params },
          {
            title: `${userDetails?.firstName} ${userDetails?.lastName}`,
            avatar: `${userDetails?.avatar}`,
            receiverId: userId
          }
        ],
        roomType: ROOM_TYPES.GROUPS,
        conversationType: CONVERSATION_TYPES.DIRECT_MESSAGES
      });
    }

    await Firechat.sendMessage(chatId, message);
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
      />
    </SafeAreaView>
  );
}
