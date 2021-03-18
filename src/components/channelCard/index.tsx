import React, { useState, useEffect } from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Channel, ChannelSort, LiteralStringForUnion } from 'stream-chat';
import FastImage from 'react-native-fast-image';
import { TrendingChannelInterface } from '../../graphql/types';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import {
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../stream/types';

import { Cover, LeftCover, Text, RightCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelProp extends TrendingChannelInterface {}

export default function MyChannel(props: MyChannelProp) {
  const { channel: channelData } = props;

  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

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
    const getConversation = async () => {
      const filter = { id: { $in: [channelData?.id] } };

      const options = { presence: true, state: true, watch: true };

      const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

      const [channel] = await chatClient.queryChannels(filter, sort, options);

      if (!channel) return;

      setChannel(channel);
    };

    if (chatClient.user) getConversation();
  }, [chatClient.user]);

  const messageCount =
    channel?.state?.messages.length || channel?.data?.member_count || 0;

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'ChannelChatScreen',
      params: {
        title: `#${channelData?.name}`,
        chatId: channelData?.id,
        isMember: channelData?.isMember,
        channelId: channelData?.id,
        details: { ...props },
        channel: {
          name: channelData?.name,
          community: channelData?.community?.name
        }
      }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{
        marginRight: 10,
        borderRadius: 5
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: channelData?.community?.avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: RFValue(130), height: RFValue(80), borderRadius: 5 }}
      >
        <Cover>
          <LeftCover>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.SMALL_SIZE),
                color: colors.WHITE,
                textTransform: 'capitalize'
              }}
            >
              #
              {channelData?.name?.length < 10
                ? channelData?.name
                : `${channelData?.name?.substr(0, 10)}...`}
            </Text>
          </LeftCover>
          <RightCover>
            <MaterialIcons
              name="chat-bubble-outline"
              size={12}
              color={colors.ONLINE}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.SMALL_SIZE),
                color: colors.ONLINE,
                textTransform: 'capitalize',
                marginHorizontal: RFValue(3)
              }}
            >
              {Number(messageCount)}
            </Text>
            <Feather name="trending-up" size={12} color={colors.ONLINE} />
          </RightCover>
        </Cover>
      </FastImage>
    </TouchableRipple>
  );
}
