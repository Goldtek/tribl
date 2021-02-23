import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageRequestScreenProps, NavigationInterface } from '../../types';
import { RFValue } from 'react-native-responsive-fontsize';
import { GiftedChat, Send, Avatar, Bubble } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import {
  Platform,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { useThemeContext } from '../../../theme';
import { MessageInterface } from '../types';
import { crashlytics, fireAuth } from '../../../firebase/config';
import { Text, Button } from 'react-native-paper';
import Firechat from '../../../firebase';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { DEVICE_FULL_HEIGHT, DEVICE_OS } from '../../../utils/device';
import {
  ACCEPT_MESSAGE_REQUEST,
  BLOCK_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST,
  MARK_MESSAGE_READ,
  SEND_DIRECT_MESSAGE
} from '../../../graphql/server/mutations';
import {
  MyPassportInterface,
  AcceptMessageRequestInterface,
  DeleteMessageRequestInterface,
  BlockMessageRequestInterface,
  ShowMessageNotificationBadge
} from '../../../graphql/types';
import hexToRGB from '../../../utils/hexToRGB';
import { GET_MESSAGE_NOTIFICATION_BADGE } from '../../../graphql/cache/query';
import { CHANGE_MESSAGE_NOTIFICATION_BADGE } from '../../../graphql/cache/mutations';
import {
  hideSensitiveView,
  tagScreenName,
  logEvent
} from '../../../utils/uxcamHelper';
import { Mixpanel } from '../../../config';
import { PAGINATION_DEFAULT } from '../../../constants';

import { Cover, TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: MessageRequestScreenProps };
}

export default function MessageRequestChat(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const modalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    tagScreenName('MessageRequestChatScreen');
  }, []);

  const {
    chatId,
    title,
    senderId,
    avatar,
    firstName,
    lastName,
    communityCount,
    connectionCount
  } = props.route.params;

  const userId = fireAuth.currentUser?.uid as string;

  const [loadEarlier, setLoadEarlier] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [pagination, setPagination] = useState(PAGINATION_DEFAULT * 2);
  const [firstMessage, setFirstMessage] = useState<MessageInterface | null>(
    null
  );

  const [userPassport] = useLazyQuery(GET_SINGLE_PASSPORT);

  const [sendMessage] = useMutation(SEND_DIRECT_MESSAGE);

  const [markConversationAsRead] = useMutation(MARK_MESSAGE_READ, {
    variables: { payload: { conversationId: chatId } }
  });

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const [changeMutation] = useMutation(CHANGE_MESSAGE_NOTIFICATION_BADGE);

  const { data: notificationData } = useQuery<ShowMessageNotificationBadge>(
    GET_MESSAGE_NOTIFICATION_BADGE
  );

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

  useEffect(() => {
    const firstChatMessages = Firechat.getChatFirstMessage(chatId);

    const unsubscribe = firstChatMessages.onSnapshot({
      next: (snapshot) => {
        if (snapshot.empty) return;

        const [document] = snapshot.docs;
        const message = document.data();

        const firstMessage = {
          ...message,
          _id: document.id,
          user: {
            ...message.sender,
            _id: message?.senderId,
            name: `${message.sender?.firstName} ${message.sender?.lastName}`
          }
        } as MessageInterface;

        setFirstMessage(firstMessage);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (!acceptRequest?.acceptMessageRequest.success) return;

    modalizeRef.current?.close();

    const chatMessages = Firechat.getChatMessages(chatId, pagination);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((document, index) => {
          const message = document.data();

          if (
            snapshot.docs.length - 1 === index &&
            notificationData?.showMessageNotificationBadge
          ) {
            changeMutation({
              variables: {
                showMessageNotificationBadge: !notificationData?.showMessageNotificationBadge
              }
            });

            setImmediate(markConversationAsRead);
          }

          if (message.senderId !== userId) {
            userPassport({ variables: { id: message?.senderId } });
          }

          if (document.id === firstMessage?._id) {
            setLoadEarlier(false);
          } else if (snapshot.size >= PAGINATION_DEFAULT) {
            setLoadEarlier(true);
          }

          return {
            ...message,
            user: { _id: message.senderId, avatar },
            _id: document.id
          } as MessageInterface;
        });

        setIsLoadingEarlier(false);
        setMessages(conversations);
      }
    });

    return () => {
      modalizeRef.current?.close();
      unsubscribe();
    };
  }, [acceptRequest?.acceptMessageRequest.success, pagination]);

  const isCloseToTop = (props: NativeScrollEvent) => {
    const { layoutMeasurement, contentOffset, contentSize } = props;
    const paddingToTop = RFValue(90);

    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  };

  const loadMoreMessage = () => {
    const nextPage = PAGINATION_DEFAULT * 2;
    setPagination(pagination + nextPage);
    setIsLoadingEarlier(true);
  };

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    const [message] = messages;
    logEvent('message request', { from: 'chat' });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    sendMessage({
      variables: { payload: { receiverId: senderId, content: message.text } }
    });
  }, []);

  const handleMessageRequest = (type: string) => async () => {
    try {
      if (type === 'block') {
        await blockMessageRequest();
        logEvent('block message request', { from: 'chat' });
      }

      if (type === 'delete') {
        await deleteMessageRequest();
        logEvent('delete message request', { from: 'chat' });
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }

    if (notificationData?.showMessageNotificationBadge) {
      changeMutation({
        variables: {
          showMessageNotificationBadge: !notificationData?.showMessageNotificationBadge
        }
      });
    }

    navigation.goBack();
  };

  const handleNavigation = useCallback(() => {
    navigation.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: props.route.params
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <GiftedChat
        ref={hideSensitiveView}
        placeholder="Start typing ..."
        messages={messages}
        user={{
          _id: userId,
          avatar: userDetails?.avatar,
          name: `${userDetails?.firstName} ${userDetails?.lastName}`
        }}
        alwaysShowSend
        loadEarlier={loadEarlier}
        isLoadingEarlier={isLoadingEarlier}
        onLoadEarlier={loadMoreMessage}
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
          scrollEventThrottle: 16,
          onEndReachedThreshold: 0.5,
          onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const { nativeEvent } = event;
            if (!isCloseToTop(nativeEvent)) return;
            loadMoreMessage();
          },
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
          alwaysOpen={DEVICE_FULL_HEIGHT / 2.5}
          modalHeight={RFValue(DEVICE_FULL_HEIGHT / 2.5)}
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
              {`${communityCount || 0} communities ${
                connectionCount || 0
              } connections`}
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
              onPress={() => {
                acceptMessageRequest();
                Mixpanel.track('User Accepts Message Request', {
                  info: `User accepts message request from ${firstName} ${lastName}`,
                  'Activity Screen': 'Message Request Chat Screen'
                });
                logEvent('accept message request', { from: 'chat' });
              }}
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
