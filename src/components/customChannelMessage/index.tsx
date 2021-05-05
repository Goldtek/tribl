import React, { useCallback } from 'react';
import {
  MessageSimple,
  MessageAvatar,
  DefaultUserType,
  MessageSimpleProps,
  DefaultChannelType,
  DefaultAttachmentType,
  MarkdownStyle
} from 'stream-chat-expo';
import { Alert, View, Text } from 'react-native';
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

import {
  Time,
  Edited,
  UserName,
  Container,
  MessageHeader,
  AvatarContainer
} from './styles';
import SimpleMarkdown from 'simple-markdown';
import { head, includes, map } from 'lodash';

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
  const { colors } = useThemeContext();
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
    const styles: MarkdownStyle = {};
    const markdownStyles = props.theme
      ? {
          ...props.theme.message.content.markdown,
          mentions: { color: colors.PRIMARY }
        }
      : {};
    const markdownRules = props.theme
      ? {
          ...props.theme.message.content.markdown,
          heading: {
            match: SimpleMarkdown.blockRegex(
              /^ *(##{1,6}) *([^\n]+?) *#* *(?:\n *)+/
            )
          },
          list: {
            react: function (node: any, output: any, { ...state }) {
              var numberIndex = 1;
              var items = map(node.items, function (item, i) {
                var bullet;
                state.withinList = false;

                if (node.ordered) {
                  bullet = React.createElement(
                    Text,
                    { key: 0, style: styles.listItemNumber },
                    numberIndex + '. '
                  );
                } else {
                  bullet = React.createElement(
                    Text,
                    { key: 0, style: styles.listItemBullet },
                    '\u2022 '
                  );
                }

                if (item.length > 1) {
                  if (item[1].type == 'list') {
                    state.withinList = true;
                  }
                }

                var content = output(item, state);
                var listItem;
                if (
                  includes(
                    ['text', 'paragraph', 'strong'],
                    (((head(item) as unknown) as any) || {}).type
                  ) &&
                  state.withinList == false
                ) {
                  state.withinList = true;
                  listItem = React.createElement(
                    Text,
                    {
                      style: [styles.listItemText, { marginBottom: 0 }],
                      key: 1
                    },
                    content
                  );
                } else {
                  listItem = React.createElement(
                    View,
                    {
                      style: styles.listItemText,
                      key: 1
                    },
                    content
                  );
                }
                state.withinList = false;
                numberIndex++;

                return React.createElement(
                  Text,
                  {
                    key: i,
                    style: styles.listRow
                  },
                  [bullet, listItem]
                );
              });

              return React.createElement(
                View,
                { key: state.key, style: styles.list },
                items
              );
            }
          }
        }
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
