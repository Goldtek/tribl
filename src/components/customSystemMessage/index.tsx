import React from 'react';
import {
  MessageSimpleProps,
  DefaultAttachmentType,
  DefaultUserType,
  DefaultChannelType,
  MessageSystem
} from 'stream-chat-expo';
import { chatClient } from '../../stream/types';
import { useNavigation } from '@react-navigation/native';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { SinglePassportRequestInterface } from '../../graphql/types';
import { useQuery } from '@apollo/react-hooks';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
type MessageProps = MessageSimpleProps<
  DefaultAttachmentType,
  DefaultChannelType,
  string & {},
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  DefaultUserType
>;

function CustomSystemMessage(props: MessageProps) {
  const navigation = useNavigation();

  const { data } = useQuery<SinglePassportRequestInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id: props.message.user?.id } }
  );

  const handleNavigation = () => {
    if (props.message.user?.id !== chatClient.user?.id) {
      navigation.navigate('MemberDetailScreen', {
        title: `${data?.singlePassport.firstName} ${data?.singlePassport.lastName}`,
        details: { ...data?.singlePassport }
      });
    }
  };

  return (
    <Container onPress={handleNavigation}>
      <MessageSystem {...props} />
    </Container>
  );
}

export default React.memo(CustomSystemMessage);
