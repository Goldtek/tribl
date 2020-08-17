import React from 'react';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import UserDetail from '../../../libs/recommendedUsers/index.json';
import GradientButton from '../../../components/gradientButton';
import { REQUEST_CONNECTION } from '../../../graphql/server/mutations';

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

  //@ts-ignore
  const passport = { ...props.route.params.details };
  //@ts-ignore
  const passportDetails = { ...props.route.params.algoliaDetail };
  const {
    phoneNumber: number,
    connected: connect,
    currentLocation: location,
    birthPlace: birthLocation,
    interest: interests,
    identity: identities
  } = passportDetails;
  const {
    phoneNumber,
    connected,
    currentLocation,
    birthPlace,
    interest,
    identity
  } = passport;
  const userDetail = UserDetail[0];

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: {
      payload: {
        phoneNumber: phoneNumber || number
      }
    }
  });

  const handleRequest = async () => {
    try {
      const { data } = await requestConnection();
      if (data?.requestConnection) {
        console.tron('successful');
      }
    } catch (error) {
      console.error(error);
    }
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
      <ContactContainer>
        <Header>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: 'https://picsum.photos/700',
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
                1
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
                2
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

        {connected || connect ? (
          <GradientButton onPress={() => {}}>
            {t(`community.memberPassport.disconnect`)}
          </GradientButton>
        ) : (
          <GradientButton onPress={handleRequest}>
            {t(`community.memberPassport.connect`)}
          </GradientButton>
        )}
        {userDetail?.birthPlace.country ? (
          <CitizenshipContainer>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginTop: RFValue(10)
              }}
            >
              {t(`community.memberPassport.bio`)}
            </Title>

            <Paragraph
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              founder/head of growth @betribl team lead e-commerce @facbook
              founder @youngbljaustin
            </Paragraph>
          </CitizenshipContainer>
        ) : null}

        {currentLocation || location ? (
          <LocationContainer>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginBottom: 10
              }}
            >
              {t(`signup.passportScreen.locality`)}
            </Title>
            {birthPlace ? (
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
                  {`${currentLocation[0].state} ${currentLocation[0].country}`}
                </Paragraph>
              </Location>
            ) : null}
            {birthPlace || birthLocation ? (
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
                  {`${currentLocation[0].state} ${currentLocation[0].country}`}
                </Paragraph>
              </Location>
            ) : null}
          </LocationContainer>
        ) : null}

        {identity?.length || identities?.length ? (
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
              {identity?.map((identity: any) => (
                <IdentityText key={identity}>{identity}</IdentityText>
              ))}{' '}
              ||{' '}
              {identities?.map((identity: any) => (
                <IdentityText key={identity}>{identity}</IdentityText>
              ))}
            </Identities>
          </IdentityContainer>
        ) : null}

        {interest?.length || interests?.length ? (
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
              {interest?.map((interest: any) => (
                <IdentityText key={interest}>{interest}</IdentityText>
              ))}{' '}
              ||{' '}
              {interests?.map((interest: any) => (
                <IdentityText key={interest}>{interest}</IdentityText>
              ))}
            </Identities>
          </InterestContainer>
        ) : null}
      </ContactContainer>
    </ScrollView>
  );
}
