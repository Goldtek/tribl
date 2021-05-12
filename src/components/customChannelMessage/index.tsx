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
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { logEvent } from '../../utils/uxcamHelper';
import Dayjs from 'dayjs';
import { Mixpanel } from '../../config';
import { useQuery } from '@apollo/react-hooks';
import { chatClient } from '../../stream/types';
import { useStreamContext } from '../../stream';
import { useNavigation } from '@react-navigation/native';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { SinglePassportRequestInterface } from '../../graphql/types';
import { MessageActionSheet } from '../streamActionSheet';
import CustomMessageFooter from '../customMessageFooter';
import CustomGiphy from '../customGiphy';
import { useThemeContext } from '../../theme';
import { CustomUrlPreview } from '../customUrlPreview';
import { getSupportedReactions } from '../../utils/supportedReactions';
import makeMarkDownRules from '../../utils/markDownRules';

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
  const { colors, fonts } = useThemeContext();
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

  //@ts-ignore
  const citizenship = JSON.parse(props?.message?.user?.citizenship || []);

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
                  if (Boolean(channel.data?.isGroup)) {
                    logEvent('send group message', { from: 'chat' });

                    Mixpanel.track(
                      'User Deletes Message On Group Message Screen',
                      {
                        info: `User deletes message on ${channel.data?.name} group`,
                        'Activity Screen': 'Group Message Screen'
                      }
                    );
                  } else {
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
                }

                if (activityScreen === 'channelThreadScreen') {
                  if (Boolean(channel.data?.isGroup)) {
                    logEvent(
                      'user deletes message on group thread message screen',
                      { from: 'chat' }
                    );

                    Mixpanel.track(
                      'User Deletes Message On Group Thread Message',
                      {
                        info: `User deletes message on ${channel.data?.name} group thread`,
                        'Activity Screen': 'Group Thread Message Screen'
                      }
                    );
                  } else {
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
      if (Boolean(channel.data?.isGroup)) {
        logEvent('user reacts to group message', { from: 'chat' });

        Mixpanel.track('User Reacts to Group Message', {
          info: `User reacts to message on ${channel.data?.name} group`,
          'Activity Screen': 'Group Message Screen'
        });
      } else {
        logEvent('user reacts to channel message', { from: 'chat' });

        Mixpanel.track('User Reacts to Channel Message', {
          info: `User reacts to message on ${channel.data?.name} channel in ${channel.data?.community.name} community`,
          'Activity Screen': 'Channel Message Screen'
        });
      }
    }

    if (activityScreen === 'channelThreadScreen') {
      if (Boolean(channel.data?.isGroup)) {
        logEvent('user reacts to group thread message', { from: 'chat' });

        Mixpanel.track('User Reacts to Group Thread Message', {
          info: `User reacts to message on ${channel.data?.name} group thread`,
          'Activity Screen': 'Group Thread Message Screen'
        });
      } else {
        logEvent('user reacts to channel thread message', { from: 'chat' });

        Mixpanel.track('User Reacts to Channel Thread Message', {
          info: `User reacts to message on ${channel.data?.name} channel thread in ${channel.data?.community.name} community`,
          'Activity Screen': 'Channel Thread Message Screen'
        });
      }
    }

    props.handleReaction(type);
  };

  const MessageTextWithName = (props: any) => {
    const markdownStyles = props.theme
      ? {
          ...props.theme.message.content.markdown,
          mentions: { color: colors.PRIMARY }
        }
      : {};

    const markdownRules = makeMarkDownRules(props);
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
        {props.renderText({
          message: props.message,
          markdownStyles,
          markdownRules
        })}
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
        {citizenship?.length &&
        props.message?.user?.id !== chatClient?.user?.id ? (
          <Title
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              lineHeight: RFValue(18),
              marginLeft: RFValue(5)
            }}
          >
            {citizenship?.map((country: any) => country.flag)}
          </Title>
        ) : null}
      </AvatarContainer>
    ),
    [data]
  );

  return (
    <MessageSimple
      {...props}
      Giphy={CustomGiphy}
      textBeforeAttachments
      //@ts-ignore
      ReactionList={null}
      onPress={handleDoubleTap}
      handleDelete={handleDelete}
      handleReaction={handleReaction}
      //@ts-ignore
      UrlPreview={CustomUrlPreview}
      //@ts-ignore
      ActionSheet={MessageActionSheet}
      MessageText={MessageTextWithName}
      MessageAvatar={CustomMessageAvatar}
      MessageFooter={CustomMessageFooter}
      supportedReactions={getSupportedReactions}
    />
  );
}

export default React.memo(CustomChannelMessage);
