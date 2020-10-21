import React, { useState, useCallback, useMemo, Fragment, useRef } from 'react';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { ScrollView, FlatList } from 'react-native';
import { Title, Paragraph, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import GradientButton from '../../../components/gradientButton';
import { REQUEST_CONNECTION } from '../../../graphql/server/mutations';
import { GET_SINGLE_PASSPORT } from '../../../graphql/server/query';
import PassportSkeleton from './widget';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { PassportInterface } from '../../../graphql/types';
import MyCommunity from './widget/tribes';
import MyConnections from './widget/connections';
import { NavigationInterface } from '../../types';
import { SinglePassportRequestInterface } from '../../../graphql/types';

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
  ButtonCover
} from './styles';

interface MemberDetailProps extends NavigationInterface {
  route: { params: { details: PassportInterface } };
}

export default function contactSlide(props: MemberDetailProps) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  const [state, setState] = useState({ loading: false, pending: false });

  const passport = { ...props.route.params.details };

  const { phoneNumber, firstName, lastName, id } = passport;

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { phoneNumber: phoneNumber } }
  });

  const { loading: passportLoading, data: passportData } = useQuery<
    SinglePassportRequestInterface
  >(GET_SINGLE_PASSPORT, { variables: { id } });

  const singlePassport = passportData?.singlePassport;

  const handleMessageNavigation = useCallback(() => {
    const messageRequest = singlePassport?.conversation?.messageRequest;
    const senderId = singlePassport?.conversation?.messageRequest?.senderId;
    const isRequestApproved =
      singlePassport?.conversation?.messageRequest?.approvedAt;
    const approveRequest =
      senderId !== singlePassport?.id && messageRequest && !isRequestApproved;

    if (approveRequest) {
      return navigation.navigate('MessageRequestScreen', {
        receiverId: id,
        chatId: `${singlePassport?.conversation?.id}`,
        title: `${firstName} ${lastName}`,
        ...passport
      });
    }

    navigation.navigate(
      singlePassport?.conversation?.id
        ? 'DirectChatScreen'
        : 'ConnectionChatScreen',
      {
        receiverId: id,
        chatId: `${singlePassport?.conversation?.id}`,
        title: `${firstName} ${lastName}`,
        ...passport
      }
    );
  }, [singlePassport]);

  const community = singlePassport?.participantOf;
  const connections = singlePassport?.myConnections;

  const handleRequest = async () => {
    setState({ ...state, loading: true });
    try {
      await requestConnection();
      setState({ ...state, loading: false, pending: true });
    } catch (error) {
      Sentry.captureException(error);
      setState({ ...state, loading: false });
    }
  };

  const { loading, pending } = state;

  const _renderMyCommunityItem = useMemo(
    () => ({ item }: any) => <MyCommunity key={item.id} {...item} />,
    []
  );

  const _renderMyConnectionItem = ({ item }: { item: PassportInterface }) => {
    return <MyConnections key={item.id} {...item} />;
  };

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
      {passportLoading ? (
        <PassportSkeleton />
      ) : (
        <ContactContainer>
          <Header>
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              source={{
                uri: singlePassport?.avatar,
                priority: FastImage.priority.high
              }}
              style={{
                width: RFValue(100),
                height: RFValue(80),
                borderRadius: 4
              }}
            />
            <ConnectionCover>
              <Connection>
                <Paragraph
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: fonts.LARGE_SIZE
                  }}
                >
                  {singlePassport?.connectionCount}
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
                  {singlePassport?.communityCount}
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
            </ConnectionCover>
          </Header>

          {singlePassport?.connected == 'CONNECTED' ||
          singlePassport?.connected == 'ACCEPTED' ? (
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
          ) : pending || singlePassport?.connected === 'PENDING' ? (
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

          {singlePassport?.bio ? (
            <Fragment>
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
                {singlePassport?.bio}
              </Text>
            </Fragment>
          ) : null}

          {singlePassport?.currentLocation || singlePassport?.birthPlace ? (
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
              {singlePassport?.birthPlace ? (
                <Location>
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
                  {singlePassport?.birthPlace[0]?.city ? (
                    <Paragraph
                      style={{
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'capitalize',
                        marginBottom: 10
                      }}
                    >
                      {`${singlePassport?.birthPlace[0]?.city}, ${singlePassport?.birthPlace[0]?.state}`}
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
                      {`${singlePassport?.birthPlace[0]?.state}, ${singlePassport?.birthPlace[0]?.country}`}
                    </Paragraph>
                  )}
                </Location>
              ) : null}
              {singlePassport?.currentLocation ? (
                <Location>
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
                  {singlePassport?.currentLocation[0]?.city ? (
                    <Paragraph
                      style={{
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'capitalize',
                        marginBottom: 10
                      }}
                    >
                      {`${singlePassport?.currentLocation[0]?.city}, ${singlePassport?.currentLocation[0]?.state}`}
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
                      {`${singlePassport?.currentLocation[0]?.state}, ${singlePassport?.currentLocation[0]?.country}`}
                    </Paragraph>
                  )}
                </Location>
              ) : null}
            </LocationContainer>
          ) : null}

          {singlePassport?.identity?.length ? (
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
                {singlePassport?.identity?.map((identity: any) => (
                  <IdentityText key={identity.id}>{identity.name}</IdentityText>
                ))}
              </Identities>
            </IdentityContainer>
          ) : null}

          {singlePassport?.interest?.length ? (
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
                {singlePassport?.interest?.map((interest: any) => (
                  <IdentityText key={interest.id}>{interest.name}</IdentityText>
                ))}
              </Identities>
            </InterestContainer>
          ) : null}
          {singlePassport?.participantOf?.length ? (
            <Fragment>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'uppercase',
                  marginBottom: 10
                }}
              >
                {t(`community.memberPassport.tribe`)}
              </Title>
              <FlatList
                data={community}
                horizontal={true}
                renderItem={_renderMyCommunityItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 5,
                  backgroundColor: colors.WHITE
                }}
              />
            </Fragment>
          ) : null}
          {singlePassport?.myConnections?.length ? (
            <Fragment>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  marginTop: RFValue(40)
                }}
              >
                {t(`community.memberPassport.connection`)}
              </Title>
              <FlatList
                data={connections}
                horizontal={true}
                keyExtractor={(_, index: number) => index.toString()}
                renderItem={_renderMyConnectionItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 5,
                  backgroundColor: colors.WHITE
                }}
              />
            </Fragment>
          ) : null}
        </ContactContainer>
      )}
    </ScrollView>
  );
}
