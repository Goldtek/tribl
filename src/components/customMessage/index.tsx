import React, { useCallback } from 'react';
import {
  MessageSimpleProps,
  DefaultAttachmentType,
  DefaultUserType,
  MessageSimple,
  DefaultChannelType,
  MessageAvatar
} from 'stream-chat-expo';
import { Alert } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { chatClient } from '../../stream/types';
import { useNavigation } from '@react-navigation/native';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { SinglePassportRequestInterface } from '../../graphql/types';

import { Container, UserName, Edited, AvatarContainer } from './styles';

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

let lastTap = 0;

function CustomMessage(props: MessageProps) {
  const navigation = useNavigation();

  const visible =
    props.groupStyles[0] === 'single' || props.groupStyles[0] === 'top';

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

  const onDelete = async () => {
    setTimeout(
      () =>
        Alert.alert(
          'Deleting message',
          'Are you sure you want to delete the message?',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () => props.handleDelete()
            }
          ],
          { cancelable: false }
        ),
      100
    );
  };

  const MessageTextWithName = (props: any) => {
    const markdownStyles = props.theme
      ? props.theme.message.content.markdown
      : {};

    const createdAt = new Date(props.message.created_at);
    const updatedAt = new Date(props.message.updated_at);
    const updated = updatedAt.getTime() > createdAt.getTime();

    return (
      <Container>
        {props.message.user?.id !== chatClient.user?.id && visible ? (
          <UserName style={{ fontWeight: 'bold' }}>
            {props.message.user.name}
          </UserName>
        ) : null}
        {props.renderText({ message: props.message, markdownStyles })}
        {updated && <Edited>(edited)</Edited>}
      </Container>
    );
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const doubleTapped = lastTap && now - lastTap < 300;
    doubleTapped ? props.openReactionPicker() : (lastTap = now);
  };

  const CustomMessageAvatar = useCallback(
    (avatarProps: any) => (
      <AvatarContainer
        onPress={handleNavigation}
        alignment={avatarProps.alignment}
      >
        <MessageAvatar {...avatarProps} />
      </AvatarContainer>
    ),
    [data]
  );

  return (
    <MessageSimple
      {...props}
      handleDelete={onDelete}
      onPress={handleDoubleTap}
      MessageText={MessageTextWithName}
      MessageAvatar={CustomMessageAvatar}
    />
  );
}

export default React.memo(CustomMessage);
