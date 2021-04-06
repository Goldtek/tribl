import React, { useState, useEffect, useRef } from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { ChannelInterface } from '../../../../../graphql/types';
import { useThemeContext } from '../../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { Channel, LiteralStringForUnion } from 'stream-chat';
import { Mixpanel } from '../../../../../config';
import { logEvent } from '../../../../../utils/uxcamHelper';
import {
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../../../stream/types';
import {
  JOIN_COMMUNITY_CHANNEL,
  SEND_CHANNEL_MESSAGE
} from '../../../../../graphql/server/mutations';
import {
  GET_CHANNEL_MEMBERS,
  GET_SINGLE_COMMUNITY
} from '../../../../../graphql/server/query';
import { useStreamContext } from '../../../../../stream';
import { useTranslation } from 'react-i18next';

import { Cover, LeftCover, Text } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelProp extends ChannelInterface {}

export default function MyChannel(props: MyChannelProp) {
  const { name, community, id, isMember } = props;

  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();
  const joinedChannel = useRef<boolean>(false);
  const { setChannel: activeChannel } = useStreamContext();

  const [channel, setChannel] = useState<
    Channel<
      LocalAttachmentType,
      LocalChannelType,
      LiteralStringForUnion,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    >
  >();

  useEffect(() => {
    if (chatClient.user) {
      const channel = chatClient.channel('team', id);
      setChannel(channel);
    }
  }, [channel, chatClient.user]);

  useQuery(GET_CHANNEL_MEMBERS, { variables: { input: { channelId: id } } });
  const [sendMessage] = useMutation(SEND_CHANNEL_MESSAGE);
  const [joinChannel] = useMutation(JOIN_COMMUNITY_CHANNEL);
  const [getChannelCommunity] = useLazyQuery(GET_SINGLE_COMMUNITY);

  const handleNavigation = () => {
    if (channel) activeChannel(channel);

    if (!isMember) {
      logEvent('join channel', { from: 'channel' });
      Mixpanel.track('User Joins Channel', {
        info: `User Joins ${name} Channel on ${community.name} community`,
        'Activity Screen': 'Community Highlight Tribe Channels List'
      });

      joinChannel({ variables: { payload: { channelId: id } } }).then(() => {
        joinedChannel.current = true;
        getChannelCommunity({ variables: { id: community.id } });
        sendMessage({
          variables: {
            payload: {
              system: true,
              channelId: id,
              content: t(`community.chat.join`)
            }
          }
        });
      });
    }

    navigation.navigate('DrawerScreen', {
      screen: 'ChannelChatScreen',
      params: { channelId: channel?.id, title: `#${name}` }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{ marginRight: 10, borderRadius: 5 }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.stretch}
        source={{
          uri: community?.avatar,
          priority: FastImage.priority.high
        }}
        style={{
          width: RFValue(130),
          height: RFValue(80),
          borderRadius: 5,
          justifyContent: 'flex-end'
        }}
      >
        <Cover>
          <LeftCover>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.SMALL_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              #{name.length < 10 ? name : `${name.substr(0, 10)}...`}
            </Text>
          </LeftCover>
          {/* <RightCover>
            <MaterialIcons
              name="chat-bubble-outline"
              size={12}
              color={colors.WHITE}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: fonts.MEDIUM_SIZE,
                color: colors.WHITE,
                textTransform: 'capitalize',
                marginHorizontal: 3
              }}
            >
              {Number(messageCount)}
            </Text>
          </RightCover> */}
        </Cover>
      </FastImage>
    </TouchableRipple>
  );
}
