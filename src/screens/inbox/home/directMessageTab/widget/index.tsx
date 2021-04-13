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
import { USER_DEFAULT_AVATAR } from '../../../../../constants';
import {
  chatClient,
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

  if (Boolean(channel.data?.isNew)) return null;

  const navigation = useNavigation();
  const { colors } = useThemeContext();
  const getMuteStatus = channel.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);
  const message = latestMessagePreview?.messageObject;
  const latestMessageDate = message?.created_at.asMutable();
  let messageText: string = `${latestMessagePreview?.text}`;

  let receiverId: any = null;
  let channelDetails: any = null;
  let receiverAvatar: any = null;
  const groupAvatar: string[] = [];

  if (Boolean(channel.data?.isDm)) {
    receiverId = Object.keys(channel.state.members).find(
      (userId: string) => userId !== chatClient.user?.id
    );
  }

  if (Boolean(channel.data?.isGroup)) {
    const members = Object.values(channel.state.members);

    for (let index = 0; index < members.length; index++) {
      const member = members[index];

      if (groupAvatar.length === 3) break;

      if (chatClient.user?.id !== member.user?.id) {
        const avatar = member.user?.image || USER_DEFAULT_AVATAR;
        groupAvatar.push(avatar);
      }

      if (members.length === 2 && groupAvatar.length < 2) {
        groupAvatar.push(`${chatClient.user?.image}`);
      }
    }
  }

  if (!receiverId && Boolean(channel.data?.isDm)) return null;

  if (Boolean(channel.data?.isDm)) {
    channelDetails = channel.state.members[`${receiverId}`].user;
    receiverAvatar = channelDetails?.image || USER_DEFAULT_AVATAR;
  }

  if (Boolean(channel.data?.isGroup)) {
    channelDetails = channel.data;

    if (Boolean(message?.group_system)) {
      messageText = `${message?.text}`;
    } else {
      messageText = `${message?.user?.name}: ${messageText}`;
    }
  }

  const handleDeleteAction = async () => {
    channel.removeMembers([`${chatClient.user?.id}`]);
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

  const handleNavigate = () => {
    setActiveChannel && setActiveChannel(channel);
    navigation.navigate('DrawerScreen', {
      screen: channelDetails?.isGroup
        ? 'ChannelChatScreen'
        : 'DirectChatScreen',
      params: { channelId: channel.id, title: channelDetails?.name }
    });
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
        onPress={handleNavigate}
        ref={hideSensitiveView}
      >
        <Fragment>
          {Boolean(channel.data?.isDm) && (
            <Avatar
              image={receiverAvatar}
              name={channelDetails?.name}
              size={RFValue(40)}
            />
          )}

          {Boolean(channel.data?.isGroup) && groupAvatar.length === 2 && (
            <GroupImageContainer>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: groupAvatar[1],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: RFValue(28),
                  height: RFValue(28),
                  borderRadius: RFValue(28 / 2),
                  right: 1,
                  bottom: 1,
                  zIndex: 2,
                  borderWidth: 2,
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
                  width: RFValue(25),
                  height: RFValue(25),
                  top: 5,
                  left: 1,
                  borderWidth: 2,
                  position: 'absolute',
                  borderColor: colors.WHITE,
                  borderRadius: RFValue(25 / 2)
                }}
              />
            </GroupImageContainer>
          )}

          {Boolean(channel.data?.isGroup) && groupAvatar.length === 3 && (
            <GroupImageContainer>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: groupAvatar[0],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: RFValue(22),
                  height: RFValue(22),
                  borderRadius: RFValue(22 / 2),
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
                  width: RFValue(25),
                  height: RFValue(25),
                  borderRadius: RFValue(25 / 2),
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
                  uri: groupAvatar[2],
                  priority: FastImage.priority.high
                }}
                style={{
                  width: RFValue(22),
                  height: RFValue(22),
                  bottom: 5,
                  borderWidth: 2,
                  borderColor: colors.WHITE,
                  borderRadius: RFValue(22 / 2)
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
    </Swipeable>
  );
}
