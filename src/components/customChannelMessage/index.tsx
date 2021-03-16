import React, { useCallback } from 'react';
import {
  MessageSimple,
  MessageAvatar,
  DefaultUserType,
  MessageSimpleProps,
  DefaultChannelType,
  DefaultAttachmentType
} from 'stream-chat-expo';
import { logEvent } from '../../utils/uxcamHelper';
import Dayjs from 'dayjs';
import { Mixpanel } from '../../config';
import { Alert } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { chatClient } from '../../stream/types';
import { useStreamContext } from '../../stream';
import { useNavigation } from '@react-navigation/native';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { SinglePassportRequestInterface } from '../../graphql/types';
import { MessageActionSheet } from '../streamActionSheet';
import CustomMessageFooter from '../customMessageFooter';
import CustomGiphy from '../customGiphy';

import {
  Time,
  Edited,
  UserName,
  Container,
  MessageHeader,
  AvatarContainer
} from './styles';

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

function CustomChannelMessage(props: MessageProps) {
  const navigation = useNavigation();
  const { channel, activityScreen } = useStreamContext();

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

                if (activityScreen === 'channelThreadScreen') {
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

    if (activityScreen === 'channelThreadScreen') {
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
        {props.message.user?.id !== chatClient.user?.id && visible ? (
          <MessageHeader>
            <UserName>{props.message.user.name}</UserName>
            <Time>{Dayjs(props.message.created_at).format('hh:ss A')}</Time>
          </MessageHeader>
        ) : null}
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

export default React.memo(CustomChannelMessage);
