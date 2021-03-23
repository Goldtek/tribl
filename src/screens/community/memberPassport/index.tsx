import React, { useState, Fragment, useEffect } from 'react';
import { Mixpanel } from '../../../config';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { ScrollView, FlatList } from 'react-native';
import { Title, Paragraph, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
// @ts-ignore
import SingleImage from '../../../libs/react-native-zoom-lightbox';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import GradientButton from '../../../components/gradientButton';
import { REQUEST_CONNECTION } from '../../../graphql/server/mutations';
import { GET_MEMBER_PASSPORT } from '../../../graphql/server/query';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import {
  CommunityInterface,
  PassportInterface,
  ChannelInterface
} from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { SinglePassportRequestInterface } from '../../../graphql/types';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {
  logEvent,
  tagScreenName,
  hideSensitiveView
} from '../../../utils/uxcamHelper';
import { crashlytics } from '../../../firebase/config';
import { useStreamContext } from '../../../stream';
import MyChannel from './widget/channelCard';
import { StatusBar } from 'expo-status-bar';
import MyConnectionCard from '../../../components/MyConnectionCard';
import MyCommunity from '../../../components/myCommunities';

import {
  ContactContainer,
  InterestContainer,
  IdentityContainer,
  Identities,
  IdentityText,
  LocationContainer,
  Location,
  Header,
  Connection,
  ConnectionCover,
  ButtonCover,
  Cover,
  HeaderCover
} from './styles';

interface MemberDetailProps extends NavigationInterface {
  route: { params: { details: PassportInterface } };
}

export default function PassportDetail(props: MemberDetailProps) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { setActivityScreen } = useStreamContext();
  const { t } = useTranslation();

  const [state, setState] = useState({ loading: false, pending: false });

  const passport = { ...props.route.params.details };

  const [data, setData] = useState({ ...passport });

  const {
    firstName,
    lastName,
    communityCount,
    currentLocation,
    connectionCount,
    citizenship,
    avatar,
    id
  } = data;

  const [displayInterest, setDisplayInterest] = useState(false);

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { id } }
  });

  const { data: passportData } = useQuery<SinglePassportRequestInterface>(
    GET_MEMBER_PASSPORT,
    { variables: { id } }
  );

  const singlePassport = passportData?.singlePassport;
  const community = singlePassport?.participantOf;
  const connections = singlePassport?.myConnections;
  const channels = singlePassport?.channelParticipantOf?.slice(0, 10);

  useEffect(() => {
    if (singlePassport?.id) {
      Mixpanel.track('User Views Member Passport', {
        info: `User Views ${firstName} ${lastName} Passport`,
        'Activity Screen': 'Member Passport Screen'
      });

      setData({ ...data, ...singlePassport });
    }
  }, [singlePassport]);

  useEffect(() => {
    tagScreenName('MemberPassportScreen');
    logEvent('view member passport', { from: 'passport' });
  }, []);

  const handleMessageNavigation = async () => {
    setActivityScreen('directMessage');
    navigation.navigate('DrawerScreen', {
      screen: 'DirectChatScreen',
      params: {
        id,
        avatar,
        lastName,
        firstName,
        title: `${firstName} ${lastName}`
      }
    });
  };

  const handleRequest = async () => {
    setState({ ...state, loading: true });
    logEvent('request connection', { from: 'passport' });
    try {
      Mixpanel.track('User Adds Connection', {
        info: `User adds ${firstName} ${lastName} as a connection`,
        'Activity Screen': 'Member Passport Screen'
      });
      await requestConnection();
      setState({ ...state, loading: false, pending: true });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      setState({ ...state, loading: false });
    }
  };

  const { loading, pending } = state;

  const _renderMyCommunityItem = ({ item }: { item: CommunityInterface }) => (
    <MyCommunity key={item.id} {...item} singlePassport={data} />
  );

  const _renderMyChannelItem = ({ item }: { item: ChannelInterface }) => (
    <MyChannel key={item.id} {...item} />
  );

  const _renderMyConnectionItem = ({ item }: { item: PassportInterface }) => (
    <MyConnectionCard key={item.id} {...item} singlePassport={data} />
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: colors.WHITE,
        paddingTop: 20,
        paddingBottom: 20
      }}
      style={{ backgroundColor: colors.WHITE }}
    >
      <StatusBar style="dark" animated />
      <ContactContainer>
        <Header>
          <SingleImage
            uri={avatar}
            style={{
              width: RFValue(100),
              height: RFValue(80),
              borderRadius: 4
            }}
          />

          <ConnectionCover>
            <Paragraph
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                paddingRight: 20,
                lineHeight: 21,
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {firstName} {lastName}
            </Paragraph>
            {currentLocation?.city ? (
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  paddingRight: 20,
                  lineHeight: 16,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              >
                {`${currentLocation?.city}, ${currentLocation?.state}`}
              </Paragraph>
            ) : (
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  paddingRight: 20,
                  lineHeight: 16,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              >
                {`${currentLocation?.state}, ${currentLocation?.country}`}
              </Paragraph>
            )}
            <HeaderCover>
              {citizenship?.length ? (
                <Title
                  style={{
                    fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.5)),
                    marginTop: RFValue(2),
                    marginRight: RFValue(15)
                  }}
                >
                  {citizenship?.map((country) => country.flag)}
                </Title>
              ) : null}
              <Connection style={{ marginRight: RFValue(10) }}>
                <Paragraph
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: fonts.LARGE_SIZE
                  }}
                >
                  {connectionCount}
                </Paragraph>
                <Paragraph
                  style={{
                    fontSize: fonts.MEDIUM_SIZE,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase'
                  }}
                >
                  {t(`community.memberPassport.connection`)}
                </Paragraph>
              </Connection>
              <Connection>
                <Paragraph
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: fonts.LARGE_SIZE
                  }}
                >
                  {communityCount}
                </Paragraph>
                <Paragraph
                  style={{
                    fontSize: fonts.MEDIUM_SIZE,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase'
                  }}
                >
                  {t(`community.memberPassport.community`)}
                </Paragraph>
              </Connection>
            </HeaderCover>
          </ConnectionCover>
        </Header>

        {data?.connectionDetails?.status === 'ACCEPTED' ? (
          <Button
            onPress={handleMessageNavigation}
            mode="outlined"
            color={colors.PRIMARY}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
            contentStyle={{
              height: RFValue(55),
              borderColor: colors.PRIMARY_TEXT
            }}
            style={{
              width: '100%',
              height: RFValue(55),
              borderRadius: 4,
              marginTop: RFValue(20),
              borderColor: colors.PRIMARY_TEXT
            }}
          >
            {t(`community.memberPassport.message`)}
          </Button>
        ) : pending ||
          data?.connectionDetails?.status === 'PENDING' ||
          data?.pending == 'PENDING' ||
          data?.pending == 'REQUESTED' ? (
          <ButtonCover>
            <Button
              disabled={true}
              mode="contained"
              color={colors.PRIMARY_TEXT}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
              contentStyle={{ height: RFValue(55) }}
              style={{
                width: DEVICE_FULL_WIDTH / 2 - 30,
                height: RFValue(55),
                borderRadius: 4,
                marginTop: RFValue(20),
                backgroundColor: colors.DISABLED
              }}
            >
              {t(`community.memberPassport.requested`)}
            </Button>
            <Button
              onPress={handleMessageNavigation}
              mode="outlined"
              color={colors.PRIMARY}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
              contentStyle={{
                height: RFValue(55),
                borderColor: colors.PRIMARY_TEXT
              }}
              style={{
                width: DEVICE_FULL_WIDTH / 2 - 30,
                height: RFValue(55),
                borderRadius: 4,
                marginTop: RFValue(20),
                borderColor: colors.PRIMARY_TEXT
              }}
            >
              {t(`community.memberPassport.message`)}
            </Button>
          </ButtonCover>
        ) : (
          <ButtonCover>
            <GradientButton
              onPress={handleRequest}
              loading={loading}
              style={{ width: DEVICE_FULL_WIDTH / 2 - 30 }}
            >
              {t(`community.memberPassport.connect`)}
            </GradientButton>
            <Button
              onPress={handleMessageNavigation}
              mode="outlined"
              color={colors.PRIMARY}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
              contentStyle={{
                height: RFValue(55),
                borderColor: colors.PRIMARY_TEXT
              }}
              style={{
                width: DEVICE_FULL_WIDTH / 2 - 30,
                height: RFValue(55),
                borderRadius: 4,
                marginTop: RFValue(20),
                borderColor: colors.PRIMARY_TEXT
              }}
            >
              {t(`community.memberPassport.message`)}
            </Button>
          </ButtonCover>
        )}

        {data?.bio ? (
          <Cover ref={hideSensitiveView}>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginBottom: 5,
                marginTop: 40
              }}
            >
              {t(`community.memberPassport.bio`)}
            </Title>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {data?.bio}
            </Text>
          </Cover>
        ) : null}

        {data?.birthPlace || data?.currentLocation ? (
          <LocationContainer>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginBottom: 5,
                marginTop: 30
              }}
            >
              {t(`signup.passportScreen.locality`)}
            </Title>

            {data?.birthPlace?.country ? (
              <Location ref={hideSensitiveView}>
                <AntDesign
                  name="home"
                  color="#CACEE5"
                  size={20}
                  style={{
                    padding: RFValue(12),
                    borderRadius: 4,
                    margin: 0,
                    marginRight: 10,
                    backgroundColor: colors.ACTION
                  }}
                />
                {data?.birthPlace?.city ? (
                  <Paragraph
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginBottom: 10
                    }}
                  >
                    {`${data?.birthPlace?.city}, ${data?.birthPlace?.state}`}
                  </Paragraph>
                ) : (
                  <Paragraph
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginBottom: 10
                    }}
                  >
                    {`${data?.birthPlace?.state}, ${data?.birthPlace?.country}`}
                  </Paragraph>
                )}
              </Location>
            ) : null}

            {currentLocation.country ? (
              <Location ref={hideSensitiveView}>
                <SimpleLineIcons
                  name="location-pin"
                  color="#CACEE5"
                  size={20}
                  style={{
                    padding: RFValue(12),
                    borderRadius: 4,
                    margin: 0,
                    marginRight: 10,
                    backgroundColor: colors.ACTION
                  }}
                />
                {currentLocation?.city ? (
                  <Paragraph
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginBottom: 10
                    }}
                  >
                    {`${currentLocation?.city}, ${currentLocation?.state}`}
                  </Paragraph>
                ) : (
                  <Paragraph
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginBottom: 10
                    }}
                  >
                    {`${currentLocation?.state}, ${currentLocation?.country}`}
                  </Paragraph>
                )}
              </Location>
            ) : null}
          </LocationContainer>
        ) : null}

        {data?.identity?.length ? (
          <IdentityContainer>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginBottom: 10
              }}
            >
              {t(`signup.passportScreen.identity`)}
            </Title>

            <Identities>
              {data?.identity?.map((identity: any) => (
                <IdentityText key={identity.id}>{identity.name}</IdentityText>
              ))}
            </Identities>
          </IdentityContainer>
        ) : null}

        {data?.interest?.length ? (
          <InterestContainer>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase'
              }}
            >
              {t(`signup.passportScreen.interest`)}
            </Title>
            <Identities>
              {data?.interest?.length > 8 ? (
                <Fragment>
                  {data?.interest.slice(0, 8).map((interest: any) => (
                    <IdentityText key={interest.id}>
                      {interest.name}
                    </IdentityText>
                  ))}
                  <TouchableHighlight
                    onPress={() => setDisplayInterest(true)}
                    underlayColor={colors.TRANSPARENT}
                    style={{
                      position: 'relative',
                      top: 20
                    }}
                  >
                    <Text
                      style={{
                        display: displayInterest ? 'none' : 'flex',
                        color: colors.PRIMARY,
                        fontSize: fonts.LARGE_SIZE - 2,
                        fontFamily: fonts.WORK_SANS_BOLD
                      }}
                    >
                      View more
                    </Text>
                  </TouchableHighlight>
                  {displayInterest ? (
                    <Fragment>
                      {data?.interest
                        .slice(8, data?.interest.length - 1)
                        .map((interest: any) => (
                          <IdentityText key={interest.id}>
                            {interest.name}
                          </IdentityText>
                        ))}
                      <TouchableHighlight
                        onPress={() => setDisplayInterest(false)}
                        underlayColor={colors.TRANSPARENT}
                        style={{
                          marginTop: RFValue(10)
                        }}
                      >
                        <Text
                          style={{
                            color: colors.PRIMARY,
                            fontSize: fonts.LARGE_SIZE - 2,
                            fontFamily: fonts.WORK_SANS_BOLD
                          }}
                        >
                          View less
                        </Text>
                      </TouchableHighlight>
                    </Fragment>
                  ) : null}
                </Fragment>
              ) : (
                <Fragment>
                  {data?.interest?.map((interest: any) => (
                    <IdentityText key={interest.id}>
                      {interest.name}
                    </IdentityText>
                  ))}
                </Fragment>
              )}
            </Identities>
          </InterestContainer>
        ) : null}

        {community?.length ? (
          <Fragment>
            <Cover style={{ flexDirection: 'row', marginTop: 10 }}>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'uppercase'
                }}
              >
                {t(`community.memberPassport.tribe`)}
              </Title>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY,
                  marginHorizontal: 2
                }}
              >
                ({community?.length})
              </Title>
            </Cover>
            <FlatList
              data={community
                ?.slice(0, 10)
                ?.concat([{ lastIndex: true } as any])}
              horizontal={true}
              keyExtractor={(community) => community.id}
              renderItem={_renderMyCommunityItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            />
          </Fragment>
        ) : null}

        {channels?.length ? (
          <Cover style={{ marginTop: 10 }}>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase'
              }}
            >
              {t(`community.memberPassport.channels`)}
            </Title>
            <FlatList
              data={channels}
              horizontal={true}
              renderItem={_renderMyChannelItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            />
          </Cover>
        ) : null}

        {connections?.length ? (
          <Cover ref={hideSensitiveView}>
            <Cover style={{ flexDirection: 'row', marginTop: 10 }}>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'uppercase'
                }}
              >
                {t(`community.memberPassport.connection`)}
              </Title>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY,
                  marginHorizontal: 2
                }}
              >
                ({connections?.length})
              </Title>
            </Cover>
            <FlatList
              data={connections
                ?.slice(0, 10)
                ?.concat([{ lastIndex: true } as any])}
              horizontal={true}
              keyExtractor={(passport) => passport.id}
              renderItem={_renderMyConnectionItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            />
          </Cover>
        ) : null}
      </ContactContainer>
    </ScrollView>
  );
}
