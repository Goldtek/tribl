import React, { Fragment, useState } from 'react';
import {
  Badge,
  TouchableRipple,
  Paragraph,
  ActivityIndicator
} from 'react-native-paper';
import { Alert, Modal } from 'react-native';
import truncate from 'lodash/truncate';
import { useThemeContext } from '../../../../../theme';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';
import {
  Avatar,
  ChannelPreviewMessengerProps,
  DefaultCommandType
} from 'stream-chat-expo';
import { useChannelPreviewDisplayName } from 'stream-chat-react-native-core/src/components/ChannelPreview/hooks/useChannelPreviewDisplayName';
import { useChannelPreviewDisplayAvatar } from 'stream-chat-react-native-core/src/components/ChannelPreview/hooks/useChannelPreviewDisplayAvatar';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';
import ChannelActions from './channelActions';
import { useStreamContext } from '../../../../../stream';
import { LEAVE_COMMUNITY_CHANNEL } from '../../../../../graphql/server/mutations';
import MuteIcon from '../../../../../../assets/icons/muteIcon';
import { crashlytics } from '../../../../../firebase/config';
import {
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Date,
  Title,
  Details,
  Overlay,
  DetailsTop,
  DetailsBottom,
  StyledMessage,
  LoaderMessage,
  ModalContentWrapper,
  NotificationContainer
} from './styles';

export default function CustomChannelPreview(
  props: ChannelPreviewMessengerProps<
    LocalAttachmentType,
    LocalChannelType,
    DefaultCommandType,
    LocalEventType,
    LocalMessageType,
    LocalReactionType,
    LocalUserType
  >
) {
  const {
    unread,
    channel,
    latestMessagePreview,
    formatLatestMessageDate,
    latestMessageLength = 40
  } = props;

  if (Boolean(channel.data?.isDm) || Boolean(channel.data?.isGroup)) {
    return null;
  }

  const navigation = useNavigation();
  const { colors } = useThemeContext();
  const { setChannel } = useStreamContext();
  const getMuteStatus = channel?.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);
  const displayName = useChannelPreviewDisplayName(channel);
  const [leaveChannel, { loading }] = useMutation(LEAVE_COMMUNITY_CHANNEL);
  const displayAvatar = useChannelPreviewDisplayAvatar(channel);
  const message = latestMessagePreview?.messageObject;
  const latestMessageDate = message?.created_at.asMutable();
  const isPrivate = channel.data?.isPrivate;

  let messageText: string = `${latestMessagePreview?.text}`;

  if (message?.type === 'system') {
    messageText = `${message?.text}`;
  } else {
    messageText = `${message?.user?.name}: ${messageText}`;
  }

  const channelTitle = channel.data?.community
    ? `${channel.data?.community.name.split(' ').join('')}-${displayName}`
    : null;

  const handleDeleteAction = async () => {
    Alert.alert(
      'Leave channel',
      `Are you sure you want to leave this channel`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Leave',
          onPress: async () => {
            try {
              leaveChannel({
                variables: { payload: { channelId: channel.id } }
              });
            } catch (error) {
              crashlytics.recordError(new Error(error));
              crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
            }
          }
        }
      ]
    );
  };

  const toggleMuteAction = async () => {
    Alert.alert('Mute channel', `Are you sure you want to mute this channel`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Mute',
        onPress: async () => {
          try {
            if (muted) {
              await channel.unmute();
              setMuted(false);
            } else {
              await channel.mute();
              setMuted(true);
            }
          } catch (error) {
            setMuted(getMuteStatus);
            crashlytics.recordError(new Error(error));
            crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
          }
        }
      }
    ]);
  };

  return (
    <Swipeable
      renderRightActions={() => (
        <ChannelActions
          handleDeleteAction={handleDeleteAction}
          toggleMuteAction={toggleMuteAction}
          muted={muted}
        />
      )}
    >
      <TouchableRipple
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.WHITE,
          padding: 10
        }}
        onPress={() => {
          setChannel(channel as any);
          navigation.navigate('DrawerScreen', {
            screen: 'ChannelChatScreen',
            params: { title: channelTitle, channelId: channel.id }
          });
        }}
        ref={hideSensitiveView}
      >
        <Fragment>
          <Avatar
            image={displayAvatar.image}
            name={displayAvatar.name}
            size={RFValue(40)}
          />
          <Details ref={hideSensitiveView}>
            <DetailsTop>
              <Paragraph>
                {isPrivate ? (
                  <Fragment>
                    <Feather
                      name="lock"
                      size={12}
                      color={colors.PRIMARY_TEXT}
                    />
                  </Fragment>
                ) : null}
                <Title ellipsizeMode="tail" numberOfLines={1}>
                  {channelTitle}
                </Title>
              </Paragraph>
              <Date>
                {formatLatestMessageDate && latestMessageDate
                  ? formatLatestMessageDate(latestMessageDate)
                  : latestMessagePreview?.created_at}
              </Date>
            </DetailsTop>
            <DetailsBottom>
              <StyledMessage unread={unread}>
                {latestMessagePreview?.text &&
                  truncate(messageText.replace(/\n/g, ' '), {
                    length: latestMessageLength
                  })}
              </StyledMessage>

              <NotificationContainer>
                {muted && (
                  <MuteIcon
                    fillColor={colors.PRIMARY}
                    style={{ marginRight: 8 }}
                  />
                )}
                {Boolean(unread) && <Badge>{unread}</Badge>}
              </NotificationContainer>
            </DetailsBottom>
          </Details>
        </Fragment>
      </TouchableRipple>

      <Modal animationType="fade" visible={loading} transparent>
        <Overlay>
          <ModalContentWrapper>
            <ActivityIndicator size="small" color={colors.BLACK} />
            <LoaderMessage>Leaving channel...</LoaderMessage>
          </ModalContentWrapper>
        </Overlay>
      </Modal>
    </Swipeable>
  );
}
