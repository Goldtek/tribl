import React, { Fragment } from 'react';
import { TouchableRipple } from 'react-native-paper';
import truncate from 'lodash/truncate';
import { useThemeContext } from '../../../../../theme';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';
import { Avatar, ChannelPreviewMessengerProps } from 'stream-chat-expo';
import { useChannelPreviewDisplayName } from 'stream-chat-react-native-core/src/components/ChannelPreview/hooks/useChannelPreviewDisplayName';
import { useChannelPreviewDisplayAvatar } from 'stream-chat-react-native-core/src/components/ChannelPreview/hooks/useChannelPreviewDisplayAvatar';
import { RFValue } from 'react-native-responsive-fontsize';

// IMPORT FOR ALL CUSTOM STYLES
import { Details, DetailsTop, Title, Date, StyledMessage } from './styles';

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

  const displayAvatar = useChannelPreviewDisplayAvatar(channel);
  const displayName = useChannelPreviewDisplayName(channel);
  const latestMessageDate = latestMessagePreview?.messageObject?.created_at?.asMutable();

  return (
    <TouchableRipple
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.light,
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
          <StyledMessage unread={unread}>
            {latestMessagePreview?.text &&
              truncate(latestMessagePreview.text.replace(/\n/g, ' '), {
                length: latestMessageLength
              })}
          </StyledMessage>
        </Details>
      </Fragment>
    </TouchableRipple>
  );
}
