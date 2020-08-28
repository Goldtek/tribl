import React, { useState, useCallback } from 'react';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import GradientButton from '../../../components/gradientButton';
import { REQUEST_CONNECTION } from '../../../graphql/server/mutations';
import { GET_SINGLE_PASSPORT } from '../../../graphql/server/query';
import PassportSkeleton from './widget';

import {
  ContactContainer,
  InterestContainer,
  IdentityContainer,
  Identities,
  IdentityText,
  LocationContainer,
  Location,
  CitizenshipContainer,
  Header,
  Connection,
  ConnectionCover
} from './styles';

interface MemberDetailProps {}

export default function contactSlide(props: MemberDetailProps) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [state, setState] = useState({ loading: false, pending: false });

  //@ts-ignore
  const passport = { ...props.route.params.details };
  //@ts-ignore
  const passportDetails = { ...props.route.params.algoliaDetail };

  const { firstName: fName, lastName: lName, id: Id } = passportDetails;

  const { phoneNumber, firstName, lastName, id: PId } = passport;
  const id = Id || PId;

  const handleMessageNavigation = useCallback(
    () =>
      navigation.navigate('ChatScreen', {
        title: `${firstName} ${lastName}` || `${fName} ${lName}`
      }),
    []
  );

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { phoneNumber } }
  });

  const { loading: passportLoading, data: passportData } = useQuery(
    GET_SINGLE_PASSPORT,
    {
      variables: { id }
    }
  );

  const SinglePassport = passportData?.singlePassport;

  const handleRequest = async () => {
    setState({ ...state, loading: true });

    try {
      const { data } = await requestConnection();

      if (data?.requestConnection) {
        setState({
          ...state,
          loading: false,
          pending: true
        });
      }
    } catch (error) {
      setState({ ...state, loading: false });
    }
  };

  const { loading, pending } = state;

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
                uri: SinglePassport?.avatar,
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
                  {SinglePassport?.connectionCount}
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
                  {SinglePassport?.communityCount}
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

          {SinglePassport?.connected === 'CONNECTED' ? (
            <Button
              onPress={handleMessageNavigation}
              mode="outlined"
              color={colors.SECONDARY_TEXT}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
              contentStyle={{ height: RFValue(55) }}
              style={{
                width: '100%',
                height: RFValue(55),
                borderRadius: 4,
                marginTop: RFValue(20)
              }}
            >
              {t(`community.memberPassport.message`)}
            </Button>
          ) : pending || SinglePassport?.connected === 'PENDING' ? (
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
                width: '100%',
                height: RFValue(55),
                borderRadius: 4,
                marginTop: RFValue(20),
                backgroundColor: colors.DISABLED
              }}
            >
              {t(`community.memberPassport.requested`)}
            </Button>
          ) : (
            <GradientButton onPress={handleRequest} loading={loading}>
              {t(`community.memberPassport.connect`)}
            </GradientButton>
          )}

          {SinglePassport?.currentLocation || SinglePassport?.birthLocation ? (
            <LocationContainer>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  marginTop: 40
                }}
              >
                {t(`signup.passportScreen.locality`)}
              </Title>
              {SinglePassport?.birthPlace ? (
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
                  <Paragraph
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginBottom: 10
                    }}
                  >
                    {`${SinglePassport?.birthPlace[0].state} ${SinglePassport?.birthPlace[0].country}`}
                  </Paragraph>
                </Location>
              ) : null}
              {SinglePassport?.currentLocation ? (
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
                  <Paragraph
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginBottom: 10
                    }}
                  >
                    {`${SinglePassport?.currentLocation[0].state} ${SinglePassport?.currentLocation[0].country}`}
                  </Paragraph>
                </Location>
              ) : null}
            </LocationContainer>
          ) : null}

          {SinglePassport?.identity?.length ? (
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
                {SinglePassport?.identity?.map((identity: any) => (
                  <IdentityText key={identity.id}>{identity.name}</IdentityText>
                ))}
              </Identities>
            </IdentityContainer>
          ) : null}

          {SinglePassport?.interest?.length ? (
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
                {SinglePassport?.interest?.map((interest: any) => (
                  <IdentityText key={interest.id}>{interest.name}</IdentityText>
                ))}
              </Identities>
            </InterestContainer>
          ) : null}
        </ContactContainer>
      )}
    </ScrollView>
  );
}
