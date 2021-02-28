import React, { Fragment, useEffect, useState } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../../../../graphql/server/query';
import { useThemeContext } from '../../../../../theme';
import hexToRGB from '../../../../../utils/hexToRGB';
import {
  MyPassportInterface,
  PassportInterface
} from '../../../../../graphql/types';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';
import { Channel, ChannelSort, LiteralStringForUnion } from 'stream-chat';
import { useStreamContext } from '../../../../../stream';
import {
  ChannelType,
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionCardProp extends PassportInterface {}

function ConnectionCard(props: ConnectionCardProp) {
  const navigation = useNavigation();
  const { setChannel, setActivityScreen } = useStreamContext();
  const { colors, fonts } = useThemeContext();
  const [channelId, setChannelId] = useState('');

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const { id, avatar, firstName, lastName, currentLocation } = props;

  useQuery(GET_SINGLE_PASSPORT, { variables: { id } });

  useEffect(() => {
    const getConversation = async () => {
      const filter = {
        isDm: true,
        type: 'team',
        member_count: 2,
        members: { $eq: [id, `${chatClient.user?.id}`] }
      };

      const options = { presence: true, state: true, watch: true };

      const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

      const [channel] = await chatClient.queryChannels(filter, sort, options);

      if (!channel) return;

      setChannelId(`${channel.id}`);
    };

    getConversation();
  }, []);

  const handleMessageNavigation = async () => {
    let channel: Channel<
      LocalAttachmentType,
      LocalChannelType,
      LiteralStringForUnion,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    > | null = null;

    if (!channelId) {
      // @ts-ignore
      channel = chatClient.channel('team', {
        conversationId: `${id}|${chatClient.user?.id}`,
        channelId: `${id}|${chatClient.user?.id}`,
        members: [id, `${chatClient.user?.id}`],
        messageRequest: { status: false },
        sender: {
          readAt: Date.now(),
          id: userData?.myPassport.id,
          avatar: userData?.myPassport.avatar,
          lastName: userData?.myPassport.lastName,
          firstName: userData?.myPassport.firstName
        },
        receiver: {
          id: id,
          avatar,
          lastName,
          firstName,
          readAt: Date.now()
        },
        name: Date.now(),
        community: {},
        isDm: true,
        isNew: true
      });

      await channel.create();
    }

    setChannel(channel as ChannelType);
    setActivityScreen('directMessage');

    navigation.navigate('DrawerScreen', {
      screen: 'DirectChatScreen',
      params: {
        title: `${firstName} ${lastName}`,
        channelId: channelId ? channelId : channel?.id,
        ...props
      }
    });
  };

  return (
    <TouchableRipple
      ref={hideSensitiveView}
      style={{
        height: RFValue(80),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RFValue(20)
      }}
      rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
      onPress={handleMessageNavigation}
    >
      <Fragment>
        {avatar ? (
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{ width: RFValue(50), height: RFValue(50), borderRadius: 4 }}
          />
        ) : (
          <Image
            source={require('../../../../../../assets/images/profile.png')}
            resizeMode="cover"
            style={{
              width: RFValue(60),
              height: RFValue(60),
              borderRadius: RFValue(4)
            }}
          />
        )}
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              textTransform: 'capitalize'
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE - 2),
              textTransform: 'lowercase'
            }}
          >
            {currentLocation?.city
              ? `${currentLocation?.city}, ${currentLocation?.state}`
              : `${currentLocation?.state}, ${currentLocation?.country}`}
          </Text>
        </NameContainer>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(ConnectionCard);
