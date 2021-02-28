import React, { Fragment, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, TouchableRipple, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { NavigationInterface } from '../../../../../types';
import { useThemeContext } from '../../../../../../theme';
import { Mixpanel } from '../../../../../../config';
import {
  JOIN_COMMUNITY_CHANNEL,
  SEND_CHANNEL_MESSAGE
} from '../../../../../../graphql/server/mutations';
import {
  ChannelInterface,
  CommunityInterface
} from '../../../../../../graphql/types';
import { logEvent } from '../../../../../../utils/uxcamHelper';
import {
  GET_CHANNEL_MEMBERS,
  GET_SINGLE_COMMUNITY
} from '../../../../../../graphql/server/query';
import {
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../../../../stream/types';
import { useStreamContext } from '../../../../../../stream';
import { Channel, LiteralStringForUnion } from 'stream-chat';

// DEFINE SCREEN PROP TYPES
interface ChannelCardProp extends NavigationInterface {
  communityDetails: CommunityInterface;
  item: ChannelInterface;
}

export default function ChannelCard(props: ChannelCardProp) {
  const { item, communityDetails } = props;
  const { isMember, id, name } = item;

  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setChannel: activeChannel } = useStreamContext();
  const { colors, fonts } = useThemeContext();
  const joinedChannel = useRef<boolean>(false);
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

  useQuery(GET_CHANNEL_MEMBERS, { variables: { input: { channelId: id } } });
  const [sendMessage] = useMutation(SEND_CHANNEL_MESSAGE);
  const [joinChannel] = useMutation(JOIN_COMMUNITY_CHANNEL);

  const [getChannelCommunity] = useLazyQuery(GET_SINGLE_COMMUNITY);

  useEffect(() => {
    const channel = chatClient.channel('team', id);
    setChannel(channel);
  }, [channel]);

  const handleNavigation = () => {
    if (channel) activeChannel(channel);

    if (!isMember) {
      logEvent('join channel', { from: 'channel' });
      Mixpanel.track('User Joins Channel', {
        info: `User Joins ${name} Channel on ${communityDetails.name} community`,
        'Activity Screen': 'Community Channel Slide Screen'
      });

      joinChannel({ variables: { payload: { channelId: id } } }).then(() => {
        joinedChannel.current = true;
        getChannelCommunity({ variables: { id: communityDetails.id } });
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
      params: {
        isMember,
        chatId: id,
        title: `#${name}`,
        channelId: channel?.id,
        channel: { name, community: communityDetails?.name }
      }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: RFValue(20),
        paddingTop: RFValue(25),
        paddingBottom: RFValue(25),
        backgroundColor: colors.WHITE
      }}
    >
      <Fragment>
        <View>
          <Paragraph
            style={{
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT
            }}
          >
            #{name}
          </Paragraph>
          {/* <Text numberOfLines={1}>
            <Text style={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}>
              3 connections
            </Text>{' '}
            and{' '}
            <Text style={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}>
              70 other members
            </Text>{' '}
            chatting live
          </Text> */}
        </View>
        <AntDesign name="caretright" size={18} color={colors.PRIMARY_TEXT} />
      </Fragment>
    </TouchableRipple>
  );
}
