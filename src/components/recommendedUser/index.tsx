import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { Mixpanel } from '../../config';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import { Channel, ChannelSort, LiteralStringForUnion } from 'stream-chat';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';
import { REQUEST_CONNECTION } from '../../graphql/server/mutations';
import {
  MyPassportInterface,
  PassportInterface,
  UserPassportInterface
} from '../../graphql/types';
import {
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../graphql/server/query';
import AdminBadge from '../adminBadge';
import { logEvent, hideSensitiveView } from '../../utils/uxcamHelper';
import { crashlytics } from '../../firebase/config';
import { useStreamContext } from '../../stream';
import {
  ChannelType,
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer, AvatarContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface RecommendedUserProp extends PassportInterface {}

export default function RecommendedUser(props: RecommendedUserProp) {
  const { colors, fonts } = useThemeContext();
  const { setChannel, setActivityScreen } = useStreamContext();

  const navigation = useNavigation();
  const { t } = useTranslation();
  const [request, setRequest] = useState(false);
  const [member, setMember] = useState(props);
  const [channelId, setChannelId] = useState('');

  const {
    id,
    avatar,
    pending,
    lastName,
    firstName,
    moderatorOf,
    currentLocation,
    connectionDetails,
    citizenship
  } = member;

  const [getUserPassport, { data }] = useLazyQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id } }
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const [requestConnection, { loading }] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { id } }
  });

  useEffect(() => {
    if (
      connectionDetails?.status == 'PENDING' ||
      pending == 'PENDING' ||
      pending == 'REQUESTED'
    ) {
      getUserPassport();
    }

    if (data?.singlePassport) {
      setMember({ ...member, ...data?.singlePassport });
    }
  }, []);

  const handleRequest = async () => {
    logEvent('request connection', { from: 'passport' });
    try {
      Mixpanel.track('User Adds Connection', {
        info: `User adds ${firstName} ${lastName} as a connection`,
        'Activity Screen': 'Recommended member passport card'
      });
      await requestConnection();
      setRequest(true);
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
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
        channelId: channelId ? channelId : channel?.id,
        title: `${firstName} ${lastName}`,
        ...member
      }
    });
  };

  const handleNavigation = useCallback(() => {
    navigation.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: { ...member }
    });
  }, []);

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: RFValue(DEVICE_FULL_WIDTH / 3),
        height: RFValue(200),
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
        marginRight: 15,
        borderWidth: 0.5,
        borderColor: hexToRGB(colors.DISABLED, 0.3)
      }}
    >
      <Card.Content
        style={{
          width: RFValue(DEVICE_FULL_WIDTH / 3),
          height: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <AvatarContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(70),
              height: RFValue(70),
              borderRadius: RFValue(70)
            }}
          />
          {moderatorOf?.length ? (
            <AdminBadge
              style={{
                position: 'absolute',
                bottom: RFValue(-5),
                right: RFValue(-25)
              }}
            />
          ) : null}
        </AvatarContainer>
        <TextContainer ref={hideSensitiveView}>
          <Title
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              marginTop: 0,
              marginBottom: 0,
              paddingHorizontal: RFValue(10),
              textTransform: 'capitalize'
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          {currentLocation?.city ? (
            <Paragraph
              numberOfLines={1}
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginTop: 0,
                marginBottom: 0,
                paddingHorizontal: RFValue(10)
              }}
            >
              {`${currentLocation?.city}, ${currentLocation?.state}`}
            </Paragraph>
          ) : (
            <Paragraph
              numberOfLines={1}
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginTop: 0,
                marginBottom: 0,
                paddingHorizontal: RFValue(10)
              }}
            >
              {`${currentLocation?.state}, ${currentLocation?.country}`}
            </Paragraph>
          )}
          {citizenship?.length ? (
            <Title
              style={{
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                marginTop: RFValue(1)
              }}
            >
              {citizenship?.map((country) => country.flag)}
            </Title>
          ) : null}
        </TextContainer>
        {connectionDetails?.status == 'PENDING' ||
        pending == 'PENDING' ||
        pending == 'REQUESTED' ||
        request ? (
          <Button
            disabled={true}
            mode="contained"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.PRIMARY_TEXT
            }}
            contentStyle={{ width: '100%', backgroundColor: colors.DISABLED }}
            style={{ borderRadius: 5 }}
          >
            {t(`community.recommended.pending`)}
          </Button>
        ) : connectionDetails?.status === 'ACCEPTED' ? (
          <Button
            mode="outlined"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.PRIMARY
            }}
            contentStyle={{
              width: '100%',
              backgroundColor: colors.WHITE,
              borderColor: colors.PRIMARY_TEXT
            }}
            style={{ borderRadius: 5, borderColor: colors.PRIMARY_TEXT }}
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
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE
            }}
            contentStyle={{
              width: '100%',
              backgroundColor: colors.PRIMARY
            }}
            style={{ borderRadius: 5 }}
            onPress={handleRequest}
          >
            {t(`community.recommended.add`)}+
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}
