import React, { Fragment, useState } from 'react';
import { Badge, TouchableRipple } from 'react-native-paper';
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
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import ChannelActions from './channelActions';
import { LEAVE_COMMUNITY_CHANNEL } from '../../../../../graphql/server/mutations';
import MuteIcon from '../../../../../../assets/icons/muteIcon';
import { GET_SINGLE_COMMUNITY } from '../../../../../graphql/server/query';
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
  DetailsTop,
  DetailsBottom,
  StyledMessage,
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
    setActiveChannel,
    latestMessagePreview,
    formatLatestMessageDate,
    latestMessageLength = 40
  } = props;

  if (channel.data?.isDm || channel.data?.isNew || channel.data?.isGroup) {
    return null;
  }

  const navigation = useNavigation();
  const { colors } = useThemeContext();
  const getMuteStatus = channel.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);
  const displayName = useChannelPreviewDisplayName(channel);
  const [leaveChannel] = useMutation(LEAVE_COMMUNITY_CHANNEL);
  const displayAvatar = useChannelPreviewDisplayAvatar(channel);
  const [getChannelCommunity] = useLazyQuery(GET_SINGLE_COMMUNITY);
  const latestMessageDate = latestMessagePreview?.messageObject?.created_at?.asMutable();

  const channelTitle = channel.data?.community
    ? `#${channel.data?.community.name.split(' ').join('')}-${displayName}`
    : null;

  const handleDeleteAction = async () => {
    await leaveChannel({ variables: { payload: { channelId: channel.id } } });
    getChannelCommunity();
  };

  const toggleMuteAction = async () => {
    try {
      if (muted) {
        await channel.unmute();
        setMuted(false);
      } else {
        await channel.mute();
        setMuted(true);
      }
    } catch {
      setMuted(getMuteStatus);
    }
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
          borderBottomColor: colors.light,
          backgroundColor: colors.WHITE,
          borderBottomWidth: 1,
          padding: 10
        }}
        onPress={() => {
          setActiveChannel && setActiveChannel(channel);
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
              <Title ellipsizeMode="tail" numberOfLines={1}>
                {channelTitle}
              </Title>
              <Date>
                {formatLatestMessageDate && latestMessageDate
                  ? formatLatestMessageDate(latestMessageDate)
                  : latestMessagePreview?.created_at}
              </Date>
            </DetailsTop>
            <DetailsBottom>
              <StyledMessage unread={unread}>
                {latestMessagePreview?.text &&
                  truncate(latestMessagePreview.text.replace(/\n/g, ' '), {
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
    </Swipeable>
  );
}
