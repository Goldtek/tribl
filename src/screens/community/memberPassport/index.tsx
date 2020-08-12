import React, { Fragment, useState, useRef } from 'react';
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

  const [state, setState] = useState({
    connect: false
  });

  //@ts-ignore
  const passport = { ...props.route.params.details };
  const phoneNumber = passport.phoneNumber;
  const userDetail = UserDetail[0];

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: {
      payload: {
        phoneNumber: phoneNumber
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
      console.tron(error);
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

        <GradientButton onPress={handleRequest}>
          {t(`community.memberPassport.connect`)}
        </GradientButton>
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

        {userDetail?.currentLocation.country &&
        userDetail?.birthPlace.country ? (
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
                {`${userDetail?.birthPlace.state} ${userDetail?.birthPlace.country}`}
              </Paragraph>
            </Location>

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
                {`${userDetail?.currentLocation.state} ${userDetail?.currentLocation.country}`}
              </Paragraph>
            </Location>
          </LocationContainer>
        ) : null}

        {userDetail?.identities.length ? (
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
              {userDetail?.identities.map((identity) => (
                <IdentityText key={identity}>{identity}</IdentityText>
              ))}
            </Identities>
          </IdentityContainer>
        ) : null}

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
            {userDetail?.interests.map((interest) => (
              <IdentityText key={interest}>{interest}</IdentityText>
            ))}
          </Identities>
        </InterestContainer>
      </ContactContainer>
    </ScrollView>
  );
}
