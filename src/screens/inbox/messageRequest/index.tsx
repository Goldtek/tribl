import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavigationInterface } from '../../types';
import { RFValue } from 'react-native-responsive-fontsize';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../theme';
import { MessageInterface } from '../types';
import { fireAuth } from '../../../firebase/config';
import { Text, Button } from 'react-native-paper';
import Firechat from '../../../firebase';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { DEVICE_FULL_HEIGHT } from '../../../utils/device';
import {
  ACCEPT_MESSAGE_REQUEST,
  BLOCK_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST
} from '../../../graphql/server/mutations';
import {
  MyPassportInterface,
  UserPassportInterface,
  AcceptMessageRequestInterface,
  DeleteMessageRequestInterface
} from '../../../graphql/types';

import { Cover, TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: { title: string; avatar: string; chatId: string; senderId: string };
  };
}

export default function ChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const modalizeRef = useRef<Modalize>(null);

  const { chatId, title, senderId } = props.route.params;

  const userId = fireAuth.currentUser?.uid as string;

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const { data: senderPassportData } = useQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id: senderId } }
  );

  const senderPassport = senderPassportData?.singlePassport;

  const [
    acceptMessageRequest,
    { data: acceptRequest, loading: acceptRequestLoading }
  ] = useMutation<AcceptMessageRequestInterface>(ACCEPT_MESSAGE_REQUEST, {
    variables: { payload: { id: chatId, senderId } }
  });

  const [deleteMessageRequest, { loading: deleteRequestLoading }] = useMutation<
    DeleteMessageRequestInterface
  >(DELETE_MESSAGE_REQUEST, { variables: { payload: { id: chatId } } });

  const [blockMessageRequest, { loading: blockRequestLoading }] = useMutation<
    DeleteMessageRequestInterface
  >(BLOCK_MESSAGE_REQUEST, { variables: { payload: { id: chatId } } });

  const userDetails = userData?.myPassport;

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    if (!acceptRequest?.updateMessageRequest.success) return;

    modalizeRef.current?.close();

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
      }
    });

    return () => {
      modalizeRef.current?.close();
      unsubscribe();
    };
  }, [acceptRequest?.updateMessageRequest.success]);

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    const [message] = messages;
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

      <Portal>
        <Modalize
          ref={modalizeRef}
          alwaysOpen={RFValue(DEVICE_FULL_HEIGHT / 4)}
          modalHeight={RFValue(DEVICE_FULL_HEIGHT / 4)}
          withHandle={false}
          panGestureEnabled={false}
          closeOnOverlayTap={false}
          withOverlay={false}
        >
          <TextContainer>
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                marginBottom: RFValue(7)
              }}
            >
              {title} wants to message you.
            </Text>
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                paddingBottom: RFValue(10),
                textTransform: 'capitalize'
              }}
            >
              {`${senderPassport?.communityCount} communities ${senderPassport?.connectionCount} connections`}
            </Text>
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textAlign: 'center'
              }}
            >
              if you accept, they will also be to see info such as your activity
              status and when you've seen messages.
            </Text>
          </TextContainer>

          <Cover>
            <Button
              onPress={blockMessageRequest}
              loading={blockRequestLoading}
              mode="text"
              labelStyle={{
                color: colors.RED,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
            >
              block
            </Button>
            <Button
              onPress={deleteMessageRequest}
              loading={deleteRequestLoading}
              mode="text"
              labelStyle={{
                color: colors.RED,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
            >
              delete
            </Button>
            <Button
              onPress={acceptMessageRequest}
              loading={acceptRequestLoading}
              mode="text"
              labelStyle={{
                color: colors.PRIMARY,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
            >
              accept
            </Button>
          </Cover>
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
}
