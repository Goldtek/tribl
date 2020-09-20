import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react-native';
import { NavigationInterface } from '../../types';
import { RFValue } from 'react-native-responsive-fontsize';
import { GiftedChat, Send, Avatar, Bubble } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
import {
  DEVICE_FULL_HEIGHT,
  DEVICE_FULL_WIDTH,
  DEVICE_OS
} from '../../../utils/device';
import {
  ACCEPT_MESSAGE_REQUEST,
  BLOCK_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST,
  SEND_DIRECT_MESSAGE
} from '../../../graphql/server/mutations';
import {
  MyPassportInterface,
  UserPassportInterface,
  AcceptMessageRequestInterface,
  DeleteMessageRequestInterface,
  BlockMessageRequestInterface
} from '../../../graphql/types';
import hexToRGB from '../../../utils/hexToRGB';

import { Cover, TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: { title: string; avatar: string; chatId: string; senderId: string };
  };
}

export default function ChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const modalizeRef = useRef<Modalize>(null);

  const { chatId, title, senderId, avatar } = props.route.params;

  const userId = fireAuth.currentUser?.uid as string;

  const [sendMessage] = useMutation(SEND_DIRECT_MESSAGE);

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
    variables: { payload: { conversationId: chatId } }
  });

  const [deleteMessageRequest, { loading: deleteRequestLoading }] = useMutation<
    DeleteMessageRequestInterface
  >(DELETE_MESSAGE_REQUEST, {
    variables: { payload: { conversationId: chatId } }
  });

  const [blockMessageRequest, { loading: blockRequestLoading }] = useMutation<
    BlockMessageRequestInterface
  >(BLOCK_MESSAGE_REQUEST, {
    variables: { payload: { conversationId: chatId } }
  });

  const userDetails = userData?.myPassport;

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    if (!acceptRequest?.acceptMessageRequest.success) return;

    modalizeRef.current?.close();

    const chatMessages = Firechat.getChatMessages(chatId);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((document) => {
          const message = document.data();
          return {
            ...message,
            user: { _id: message.senderId, avatar },
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
  }, [acceptRequest?.acceptMessageRequest.success]);

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    const payloadMessages = messages.map((message) => {
      return sendMessage({
        variables: { payload: { receiverId: senderId, content: message.text } }
      });
    });

    const test = await Promise.all(payloadMessages);
    console.tron(test);
  }, []);

  const handleMessageRequest = (type: string) => async () => {
    switch (type) {
      case 'block':
        const blockRequest = await blockMessageRequest();
        console.log({ blockRequest });
        if (blockRequest.data?.blockMessageRequest.success) {
          navigation.goBack();
        }
        break;

      case 'delete':
        try {
          const deleteRequest = await deleteMessageRequest();
          console.log({ deleteRequest });
          if (deleteRequest.data?.deleteMessageRequest.success) {
            navigation.goBack();
          }
        } catch (error) {
          Sentry.captureException(error);
        }

        break;

      default:
        break;
    }
  };

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

      <Portal>
        <Modalize
          ref={modalizeRef}
          alwaysOpen={RFValue(
            DEVICE_FULL_WIDTH <= 375
              ? DEVICE_FULL_HEIGHT / 3
              : DEVICE_FULL_HEIGHT / 4
          )}
          modalHeight={RFValue(
            DEVICE_FULL_WIDTH <= 375
              ? DEVICE_FULL_HEIGHT / 3
              : DEVICE_FULL_HEIGHT / 4
          )}
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
              onPress={handleMessageRequest('block')}
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
              onPress={handleMessageRequest('delete')}
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
