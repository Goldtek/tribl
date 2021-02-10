import React from 'react';
import {
  MessageSimple,
  DefaultUserType,
  MessageSimpleProps,
  DefaultChannelType,
  DefaultAttachmentType
} from 'stream-chat-expo';
import { Alert } from 'react-native';
import { Mixpanel } from '../../config';
import { useStreamContext } from '../../stream';
import { logEvent } from '../../utils/uxcamHelper';
import { MessageActionSheet } from '../streamActionSheet';

import { Container, Edited } from './styles';

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
  const { channel, activityScreen } = useStreamContext();

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
                if (activityScreen === 'channelScreen') {
                  logEvent('user deletes message on channel message screen', {
                    from: 'chat'
                  });

                  Mixpanel.track(
                    'User Deletes Message On Channel Message Screen',
                    {
                      info: `User deletes message on ${channel.data?.name} channel in ${channel.data?.community.name} community`,
                      'Activity Screen': 'Channel Message Screen'
                    }
                  );
                }

                if (activityScreen === 'threadScreen') {
                  logEvent(
                    'user deletes message on channel thread message screen',
                    { from: 'chat' }
                  );

                  Mixpanel.track(
                    'User Deletes Message On Channel Thread Message',
                    {
                      info: `User deletes message on ${channel.data?.name} channel thread in ${channel.data?.community.name} community`,
                      'Activity Screen': 'Channel Thread Message Screen'
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
    if (activityScreen === 'channelScreen') {
      logEvent('user reacts to channel message', { from: 'chat' });

      Mixpanel.track('User Reacts to Channel Message', {
        info: `User reacts to message on ${channel.data?.name} channel in ${channel.data?.community.name} community`,
        'Activity Screen': 'Channel Message Screen'
      });
    }

    if (activityScreen === 'threadScreen') {
      logEvent('user reacts to channel thread message', { from: 'chat' });

      Mixpanel.track('User Reacts to Channel Thread Message', {
        info: `User reacts to message on ${channel.data?.name} channel thread in ${channel.data?.community.name} community`,
        'Activity Screen': 'Channel Thread Message Screen'
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
    const doubleTapped = lastTap && now - lastTap < 300;
    doubleTapped ? props.openReactionPicker() : (lastTap = now);
  };

  return (
    <MessageSimple
      {...props}
      onPress={handleDoubleTap}
      handleDelete={handleDelete}
      handleReaction={handleReaction}
      //@ts-ignore
      ActionSheet={MessageActionSheet}
      MessageText={MessageTextWithName}
      MessageAvatar={() => null}
    />
  );
}

export default React.memo(CustomDirectMessage);
