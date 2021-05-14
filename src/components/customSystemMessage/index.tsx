import React, { Fragment, useEffect } from 'react';
import {
  isDayOrMoment,
  MessageSimpleProps,
  DefaultChannelType,
  TDateTimeParserInput,
  useTranslationContext,
  DefaultAttachmentType
} from 'stream-chat-expo';
import { useQuery } from '@apollo/react-hooks';
import {
  chatClient,
  LocalUserType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType
} from '../../stream/types';
import { useLazyQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../graphql/server/query';
import {
  MyPassportInterface,
  SinglePassportRequestInterface
} from '../../graphql/types';

import {
  Text,
  DateText,
  Container,
  TextContainer,
  InvitationContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
type MessageSystemProps = MessageSimpleProps<
  DefaultAttachmentType,
  DefaultChannelType,
  string & {},
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
>;

/**
 * A component to display system message. e.g, when someone updates the channel,
 * they can attach a message with that update. That message will be available
 * in message list as (type) system message.
 */
function CustomSystemMessage(props: MessageSystemProps) {
  const navigation = useNavigation();
  const { formatDate, message } = props;

  const { tDateTimeParser } = useTranslationContext();
  const { data: userOfflineData } = useQuery<MyPassportInterface>(
    GET_USER_PASSPORT
  );
  const blockedUsers = userOfflineData?.myPassport?.privacy?.blocked;
  const user = Boolean(message.group_system) ? message.receiver : message.user;
  const blockedUser = blockedUsers?.some((user) => user?.id === user.id);

  if (Boolean(blockedUser)) return null;

  const [getUserPassport, { data: userData }] = useLazyQuery<
    SinglePassportRequestInterface
  >(GET_SINGLE_PASSPORT);

  const [getInvitationSenderPassport, { data: senderData }] = useLazyQuery<
    SinglePassportRequestInterface
  >(GET_SINGLE_PASSPORT);

  const [getInvitationReceiverPassport, { data: receiverData }] = useLazyQuery<
    SinglePassportRequestInterface
  >(GET_SINGLE_PASSPORT);

  useEffect(() => {
    if (Boolean(message?.invitation)) {
      if (message.sender?.id !== chatClient.user?.id) {
        getInvitationSenderPassport({ variables: { id: message.sender?.id } });
      }

      if (message.receiver?.id !== chatClient.user?.id) {
        getInvitationReceiverPassport({
          variables: { id: message.receiver?.id }
        });
      }
    } else {
      getUserPassport({ variables: { id: user?.id } });
    }
  }, []);

  const createdAt = message.created_at as TDateTimeParserInput | undefined;
  const parsedDate = tDateTimeParser(createdAt);
  const date =
    formatDate && createdAt
      ? formatDate(createdAt)
      : parsedDate && isDayOrMoment(parsedDate)
      ? //@ts-ignore
        parsedDate.calendar().toUpperCase()
      : parsedDate;

  let text: string = '';
  let senderName = message.user?.name?.split(' ')[0].trim();
  let receiverName = message.user?.name?.split(' ')[0].trim();

  if (Boolean(message?.group_system)) {
    senderName = message?.receiver?.name?.split(' ')[0].trim();
    const result = message.text?.split(`${senderName}`).join('');
    text = result ? `${result.trim()}` : '';
  } else {
    const result = message.text?.match(/joined this channel/gi);
    text = result ? `${result[0].trim()}` : 'joined this channel';
  }

  const handleNavigation = () => {
    if (user?.id !== chatClient.user?.id) {
      navigation.navigate('MemberDetailScreen', {
        title: `${userData?.singlePassport.firstName} ${userData?.singlePassport.lastName}`,
        details: { ...userData?.singlePassport }
      });
    }
  };

  const navigateInvitationSender = (userId: string) => {
    if (userId !== chatClient.user?.id) {
      navigation.navigate('MemberDetailScreen', {
        title: `${senderData?.singlePassport.firstName} ${senderData?.singlePassport.lastName}`,
        details: { ...senderData?.singlePassport }
      });
    }
  };

  const navigateInvitationReceiver = (userId: string) => {
    if (userId !== chatClient.user?.id) {
      navigation.navigate('MemberDetailScreen', {
        title: `${receiverData?.singlePassport.firstName} ${receiverData?.singlePassport.lastName}`,
        details: { ...receiverData?.singlePassport }
      });
    }
  };

  if (Boolean(message?.invitation)) {
    senderName = message.sender?.name?.split(' ')[0].trim();
    receiverName = message.receiver?.name?.split(' ')[0].trim();

    return (
      <InvitationContainer>
        <TextContainer>
          <Text
            onPress={() => navigateInvitationSender(message.sender?.id)}
            clickable={Boolean(senderName)}
          >
            {senderName}
          </Text>
          <Text>invited</Text>
          <Text
            onPress={() => navigateInvitationReceiver(message.receiver?.id)}
            clickable={Boolean(receiverName)}
          >
            {receiverName}
          </Text>
          <Text>into the channel</Text>
        </TextContainer>
        <DateText>{date}</DateText>
      </InvitationContainer>
    );
  }

  return (
    <Container onPress={handleNavigation}>
      <Fragment>
        <TextContainer>
          <Text clickable={Boolean(senderName)}>{senderName}</Text>
          <Text>{text}</Text>
        </TextContainer>
        <DateText>{date}</DateText>
      </Fragment>
    </Container>
  );
}

export default React.memo(CustomSystemMessage);
