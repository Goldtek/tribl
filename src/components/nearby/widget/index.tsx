import React, { Fragment, useEffect, useState } from 'react';
import { Title, Paragraph, TouchableRipple, Button } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { REQUEST_CONNECTION } from '../../../graphql/server/mutations';
import { MyPassportInterface, PassportInterface } from '../../../graphql/types';
import { rootNavigator } from '../../../constants';
import hexToRGB from '../../../utils/hexToRGB';
import { crashlytics } from '../../../firebase/config';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { logEvent } from '../../../utils/uxcamHelper';
import { useStreamContext } from '../../../stream';
import {
  ChannelType,
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../stream/types';
import { Channel, ChannelSort, LiteralStringForUnion } from 'stream-chat';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface NearbyUserProp extends PassportInterface {
  NearbyUserModal(): void;
}

function NearbyModal(props: NearbyUserProp) {
  const { colors, fonts } = useThemeContext();
  const { setChannel, setActivityScreen } = useStreamContext();

  const { t } = useTranslation();

  const { NearbyUserModal, ...member } = props;

  const {
    id,
    avatar,
    lastName,
    firstName,
    connected,
    phoneNumber,
    currentLocation
  } = member;

  const [pending, setPending] = useState(false);

  const [channelId, setChannelId] = useState('');

  const [requestConnection, { loading }] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { phoneNumber } }
  });

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const handleRequest = async () => {
    logEvent('request connection', { from: 'passport' });
    try {
      await requestConnection();
      setPending(true);
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const handleNavigation = () => {
    NearbyUserModal();
    rootNavigator.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: member
    });
  };

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
    NearbyUserModal();

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

    rootNavigator.navigate('DrawerScreen', {
      screen: 'DirectChatScreen',
      params: {
        channelId: channelId ? channelId : channel?.id,
        title: `${firstName} ${lastName}`,
        ...member
      }
    });
  };

  const state = currentLocation[0]?.state;
  const country = currentLocation[0]?.country;
  const city = currentLocation[0]?.city;

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12
      }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(50),
            height: RFValue(50),
            borderRadius: RFValue(5)
          }}
        />
        <TextContainer>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          {city && state ? (
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(15),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${city}, ${state}`}
            </Paragraph>
          ) : (
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(15),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${state}, ${country}`}
            </Paragraph>
          )}
        </TextContainer>
        {connected == 'PENDING' || pending ? (
          <Button
            mode="text"
            disabled={true}
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.SMALL_SIZE),
              textTransform: 'capitalize',
              color: colors.PRIMARY_TEXT,
              marginHorizontal: 0
            }}
            contentStyle={{
              backgroundColor: colors.DISABLED,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            style={{ borderRadius: 5, width: RFValue(60) }}
          >
            {t(`community.recommended.pending`)}
          </Button>
        ) : connected == 'CONNECTED' || connected == 'ACCEPTED' ? (
          <Button
            mode="text"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.SMALL_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE,
              marginHorizontal: 0
            }}
            contentStyle={{
              backgroundColor: colors.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            style={{ borderRadius: 5, width: RFValue(60) }}
            onPress={handleMessageNavigation}
          >
            {t(`community.recommended.message`)}
          </Button>
        ) : (
          <Button
            loading={loading}
            mode="contained"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.SMALL_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE
            }}
            contentStyle={{
              backgroundColor: colors.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            style={{ borderRadius: 5, width: RFValue(60) }}
            onPress={handleRequest}
          >
            {t(`community.recommended.add`)}+
          </Button>
        )}
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(NearbyModal, () => false);
