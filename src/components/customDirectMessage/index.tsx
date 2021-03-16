import React, { useCallback } from 'react';
import {
  MessageSimple,
  MessageAvatar,
  DefaultUserType,
  MessageSimpleProps,
  DefaultChannelType,
  DefaultAttachmentType
} from 'stream-chat-expo';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/react-hooks';
import { Mixpanel } from '../../config';
import { useStreamContext } from '../../stream';
import { logEvent } from '../../utils/uxcamHelper';
import { MessageActionSheet } from '../streamActionSheet';
import { chatClient } from '../../stream/types';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { SinglePassportRequestInterface } from '../../graphql/types';
import CustomMessageFooter from '../customMessageFooter';
import CustomGiphy from '../customGiphy';

import { AvatarContainer, Container, Edited } from './styles';

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

function CustomDirectMessage(props: MessageProps) {
  const navigation = useNavigation();

  const { channel, activityScreen } = useStreamContext();

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

  const handleDelete = async () => {
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
              onPress: () => {
                if (activityScreen === 'directMessage') {
                  logEvent('user deletes message on direct message screen', {
                    from: 'chat'
                  });

                  Mixpanel.track(
                    'User Deletes Message On Direct Message Screen',
                    {
                      info: `${props.message.user?.name} deletes his message on a conversation with ${channel.data?.receiver.firstName} ${channel.data?.receiver.lastName}}`,
                      'Activity Screen': 'Direct Message Screen'
                    }
                  );
                }

                if (activityScreen === 'directMessageThreadScreen') {
                  logEvent('user deletes message on DM thread screen', {
                    from: 'chat'
                  });

                  Mixpanel.track(
                    'User Deletes Message On Direct Message Thread Screen',
                    {
                      info: `${props.message.user?.name} deletes his message on a conversation with ${channel.data?.receiver.firstName} ${channel.data?.receiver.lastName}} in a DM thread screen`,
                      'Activity Screen': 'Direct Message Thread Screen'
                    }
                  );
                }

                props.handleDelete();
              }
            }
          ],
          { cancelable: false }
        ),
      100
    );
  };

  const handleReaction = async (type: string) => {
    if (activityScreen === 'directMessage') {
      logEvent('user reacts to direct message', { from: 'chat' });

      Mixpanel.track('User Reacts to Direct Message', {
        info: `User reacts to ${props.message.user?.name} message`,
        'Activity Screen': 'Channel Message Screen'
      });
    }

    if (activityScreen === 'directMessageThreadScreen') {
      logEvent('user reacts to DM thread message', { from: 'chat' });

      Mixpanel.track('User Reacts to DM Thread Message', {
        info: `User reacts to ${props.message.user?.name} DM thread message`,
        'Activity Screen': 'Direct Message Thread Screen'
      });
    }

    props.handleReaction(type);
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
        {props.renderText({ message: props.message, markdownStyles })}
        {updated && <Edited>(edited)</Edited>}
      </Container>
    );
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const doubleTapped = lastTap && now - lastTap < 650;
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
      Giphy={CustomGiphy}
      ReactionList={() => null}
      onPress={handleDoubleTap}
      handleDelete={handleDelete}
      handleReaction={handleReaction}
      MessageFooter={CustomMessageFooter}
      //@ts-ignore
      ActionSheet={MessageActionSheet}
      MessageText={MessageTextWithName}
      MessageAvatar={CustomMessageAvatar}
    />
  );
}

export default React.memo(CustomDirectMessage);
