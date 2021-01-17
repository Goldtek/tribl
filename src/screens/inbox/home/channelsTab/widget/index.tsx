import React, { Fragment, useState } from 'react';
import { Badge, TouchableRipple } from 'react-native-paper';
import truncate from 'lodash/truncate';
import { useThemeContext } from '../../../../../theme';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';
import { Avatar, ChannelPreviewMessengerProps } from 'stream-chat-expo';
import { useChannelPreviewDisplayName } from 'stream-chat-react-native-core/src/components/ChannelPreview/hooks/useChannelPreviewDisplayName';
import { useChannelPreviewDisplayAvatar } from 'stream-chat-react-native-core/src/components/ChannelPreview/hooks/useChannelPreviewDisplayAvatar';
import { RFValue } from 'react-native-responsive-fontsize';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ChannelActions from './channelActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  props: ChannelPreviewMessengerProps
) {
  const {
    unread,
    channel,
    latestMessageLength = 30,
    setActiveChannel,
    latestMessagePreview,
    formatLatestMessageDate
  } = props;

  const { colors } = useThemeContext();

  const getMuteStatus = channel.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);

  const displayAvatar = useChannelPreviewDisplayAvatar(channel);
  const displayName = useChannelPreviewDisplayName(channel);
  const latestMessageDate = latestMessagePreview?.messageObject?.created_at?.asMutable();

  const handleDeleteAction = () => channel.delete();

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
        onPress={() => setActiveChannel && setActiveChannel(channel)}
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
                {displayName}
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
                {Boolean(unread) && <Badge>{unread}</Badge>}

                {muted && (
                  <MaterialCommunityIcons
                    name="volume-off"
                    size={12}
                    color={colors.PRIMARY}
                    style={{ marginLeft: 10 }}
                  />
                )}
              </NotificationContainer>
            </DetailsBottom>
          </Details>
        </Fragment>
      </TouchableRipple>
    </Swipeable>
  );
}
