import React, { Fragment, useState } from 'react';
import { Badge, TouchableRipple } from 'react-native-paper';
import truncate from 'lodash/truncate';
import { useThemeContext } from '../../../../../theme';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';
import FastImage from 'react-native-fast-image';
import {
  Avatar,
  ChannelPreviewMessengerProps,
  DefaultCommandType
} from 'stream-chat-expo';
import { RFValue } from 'react-native-responsive-fontsize';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';
import ChannelActions from './channelActions';
import MuteIcon from '../../../../../../assets/icons/muteIcon';
import {
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../../../stream/types';
import { USER_DEFAULT_AVATAR } from '../../../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Date,
  Title,
  Details,
  DetailsTop,
  DetailsBottom,
  StyledMessage,
  GroupImageContainer,
  NotificationContainer
} from './styles';

export default function CustomDirectMessagePreview(
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

  if (channel.data?.isNew) return null;

  const navigation = useNavigation();
  const { colors } = useThemeContext();
  const getMuteStatus = channel.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);
  const latestMessageDate = latestMessagePreview?.messageObject?.created_at?.asMutable();

  let receiverId: any = null;
  let channelDetails: any = null;
  let receiverAvatar: any = null;
  const groupAvatar: string[] = [];

  if (channel.data?.isDm) {
    receiverId = Object.keys(channel.state.members).find(
      (userId: string) => userId !== chatClient.user?.id
    );
  } else if (channel.data?.isGroup) {
    const members = Object.values(channel.state.members);

    for (let index = 0; index < members.length; index++) {
      const member = members[index];

      if (chatClient.user?.id !== member.user?.id && groupAvatar.length !== 3) {
        const avatar = member.user?.user.avatar || USER_DEFAULT_AVATAR;
        groupAvatar.push(avatar);
      } else continue;

      if (groupAvatar.length === 3) break;
    }
  }

  if (!receiverId && channel.data?.isDm) return null;

  if (channel.data?.isDm) {
    channelDetails = channel.state.members[`${receiverId}`].user;
    receiverAvatar = channelDetails?.image || USER_DEFAULT_AVATAR;
  } else if (channel.data?.isGroup) {
    channelDetails = channel.data;
  }

  const handleDeleteAction = async () => {};

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
          muted={muted}
          toggleMuteAction={toggleMuteAction}
          handleDeleteAction={handleDeleteAction}
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
            screen: 'DirectChatScreen',
            params: { channelId: channel.id, title: channelDetails?.name }
          });
        }}
        ref={hideSensitiveView}
      >
        <Fragment>
          {channel.data?.isDm && (
            <Avatar
              image={receiverAvatar}
              name={channelDetails?.name}
              size={RFValue(40)}
            />
          )}

          {channel.data?.isGroup && groupAvatar.length < 3 && (
            <GroupImageContainer>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: groupAvatar[1],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                  zIndex: 2,
                  borderWidth: 2,
                  right: 1,
                  bottom: 1,
                  position: 'absolute',
                  borderColor: colors.WHITE
                }}
              />

              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: groupAvatar[0],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: 30,
                  height: 30,
                  left: 1,
                  top: 5,
                  borderRadius: 30 / 2,
                  position: 'absolute',
                  borderColor: colors.WHITE,
                  borderWidth: 2
                }}
              />
            </GroupImageContainer>
          )}

          {channel.data?.isGroup && groupAvatar.length > 3 && (
            <GroupImageContainer>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: groupAvatar[0],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 28 / 2,
                  borderColor: colors.WHITE,
                  bottom: 5,
                  borderWidth: 2
                }}
              />

              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: groupAvatar[1],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 32 / 2,
                  top: 20,
                  zIndex: 2,
                  borderWidth: 2,
                  borderColor: colors.WHITE,
                  position: 'absolute'
                }}
              />

              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: groupAvatar[0],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: 28,
                  height: 28,
                  bottom: 5,
                  borderWidth: 2,
                  borderColor: colors.WHITE,
                  borderRadius: 28 / 2
                }}
              />
            </GroupImageContainer>
          )}

          <Details ref={hideSensitiveView}>
            <DetailsTop>
              <Title ellipsizeMode="tail" numberOfLines={1}>
                {channelDetails?.name}
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
