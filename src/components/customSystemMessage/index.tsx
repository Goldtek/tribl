import React, { Fragment } from 'react';
import {
  isDayOrMoment,
  MessageSimpleProps,
  DefaultChannelType,
  TDateTimeParserInput,
  useTranslationContext,
  DefaultAttachmentType
} from 'stream-chat-expo';
import {
  chatClient,
  LocalUserType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType
} from '../../stream/types';
import { useQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { SinglePassportRequestInterface } from '../../graphql/types';

import { Container, TextContainer, Text, DateText } from './styles';

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

  const user = Boolean(message.group_system) ? message.receiver : message.user;

  const { data } = useQuery<SinglePassportRequestInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id: user?.id } }
  );

  const handleNavigation = () => {
    if (user?.id !== chatClient.user?.id) {
      navigation.navigate('MemberDetailScreen', {
        title: `${data?.singlePassport.firstName} ${data?.singlePassport.lastName}`,
        details: { ...data?.singlePassport }
      });
    }
  };

  const createdAt = message.created_at as TDateTimeParserInput | undefined;
  const parsedDate = tDateTimeParser(createdAt);
  const date =
    formatDate && createdAt
      ? formatDate(createdAt)
      : parsedDate && isDayOrMoment(parsedDate)
      ? parsedDate.calendar().toUpperCase()
      : parsedDate;

  let text: string = '';
  let firstName = message.user?.name?.split(' ')[0].trim();

  if (Boolean(message?.group_system)) {
    firstName = message?.receiver?.name?.split(' ')[0].trim();
    const result = message.text?.split(`${firstName}`).join('');
    text = result ? `${result.trim()}` : '';
  } else {
    const result = message.text?.match(/joined this channel/gi);
    text = result ? `${result[0].trim()}` : 'joined this channel';
  }

  return (
    <Container onPress={handleNavigation}>
      <Fragment>
        <TextContainer>
          <Text firstName={firstName}>{firstName}</Text>
          <Text>{text}</Text>
        </TextContainer>
        <DateText>{date}</DateText>
      </Fragment>
    </Container>
  );
}

export default React.memo(CustomSystemMessage);
