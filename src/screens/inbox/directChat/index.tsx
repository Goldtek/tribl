import React, { useState, useEffect, useCallback } from 'react';
import { ChatScreenProps, NavigationInterface } from '../../types';
import { GiftedChat, Send, Avatar, Bubble } from 'react-native-gifted-chat';
import {
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mixpanel } from '../../../config';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../theme';
import { MessageInterface } from '../types';
import { fireAuth } from '../../../firebase/config';
import Firechat from '../../../firebase';
import {
  MyPassportInterface,
  ShowMessageNotificationBadge
} from '../../../graphql/types';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import {
  MARK_MESSAGE_READ,
  SEND_DIRECT_MESSAGE
} from '../../../graphql/server/mutations';
import { DEVICE_OS } from '../../../utils/device';
import hexToRGB from '../../../utils/hexToRGB';
import { CHANGE_MESSAGE_NOTIFICATION_BADGE } from '../../../graphql/cache/mutations';
import { GET_MESSAGE_NOTIFICATION_BADGE } from '../../../graphql/cache/query';
import {
  hideSensitiveView,
  tagScreenName,
  logEvent
} from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: ChatScreenProps };
}

export default function DirectChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const {
    chatId,
    receiverId,
    avatar,
    firstName,
    lastName
  } = props.route.params;

  const userId = fireAuth.currentUser?.uid;

  useEffect(() => {
    tagScreenName('DirectChatScreen');
  }, []);

  const [userPassport] = useLazyQuery(GET_SINGLE_PASSPORT);

  const [sendMessage] = useMutation(SEND_DIRECT_MESSAGE);

  const [markConversationAsRead] = useMutation(MARK_MESSAGE_READ, {
    variables: { payload: { conversationId: chatId } }
  });

  const { data: notificationData } = useQuery<ShowMessageNotificationBadge>(
    GET_MESSAGE_NOTIFICATION_BADGE
  );

  const [changeMutation] = useMutation(CHANGE_MESSAGE_NOTIFICATION_BADGE);

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const [loadEarlier, setLoadEarlier] = useState(false);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [pagination, setPagination] = useState(PAGINATION_DEFAULT * 2);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [firstMessage, setFirstMessage] = useState<MessageInterface | null>(
    null
  );

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
    const chatMessages = Firechat.getChatMessages(chatId, pagination);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((document, index) => {
          const message = document.data();

          if (snapshot.docs.length - 1 === index) {
            if (notificationData?.showMessageNotificationBadge) {
              changeMutation({
                variables: {
                  showMessageNotificationBadge: !notificationData?.showMessageNotificationBadge
                }
              });
            }
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

    return () => unsubscribe();
  }, [pagination, chatId]);

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
    logEvent('send direct message', { from: 'chat' });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    Mixpanel.track('User Sends DM', {
      info: `User sends direct message to ${firstName} ${lastName}`,
      'Activity Screen': 'Direct Message Screen'
    });

    sendMessage({
      variables: { payload: { receiverId, content: message.text } }
    });
  }, []);

  const handleNavigation = useCallback(() => {
    navigation.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: props.route.params
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <GiftedChat
        placeholder="Start typing ..."
        messages={messages}
        ref={hideSensitiveView}
        user={{
          _id: userId as string,
          avatar: userDetails?.avatar,
          name: `${userDetails?.firstName} ${userDetails?.lastName}`
        }}
        alwaysShowSend={true}
        loadEarlier={loadEarlier}
        isLoadingEarlier={isLoadingEarlier}
        onLoadEarlier={loadMoreMessage}
        onPressAvatar={handleNavigation}
        onSend={onSend}
        renderSend={(props) => (
          <Send
            {...props}
            ref={hideSensitiveView}
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
          onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const { nativeEvent } = event;
            if (!isCloseToTop(nativeEvent)) return;
            loadMoreMessage();
          },
          onEndReachedThreshold: 0.5,
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
            ref={hideSensitiveView}
            imageStyle={{
              left: { marginRight: RFValue(-7), borderRadius: RFValue(40 / 2) },
              right: {}
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            ref={hideSensitiveView}
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
          keyboardVerticalOffset={RFValue(-140)}
        />
      )}
    </SafeAreaView>
  );
}
