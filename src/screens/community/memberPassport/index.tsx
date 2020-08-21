import React, { useState, useCallback } from 'react';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
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
  const navigation = useNavigation();
  const [state, setState] = useState({
    loading: false
  });

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
    identity: identities,
    firstName: fName,
    lastName: lName
  } = passportDetails;
  const {
    phoneNumber,
    connected,
    currentLocation,
    birthPlace,
    interest,
    identity,
    firstName,
    lastName
  } = passport;

  const handleMessageNavigation = useCallback(
    () =>
      navigation.navigate('ChatScreen', {
        title: `${firstName} ${lastName}` || `${fName} ${lName}`
      }),
    []
  );

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: {
      payload: {
        phoneNumber: phoneNumber || number
      }
    }
  });

  const handleRequest = async () => {
    setState({
      ...state,
      loading: true
    });
    try {
      const { data } = await requestConnection();
      if (data?.requestConnection) {
        setState({
          ...state,
          loading: false
        });
      }
    } catch (error) {
      setState({
        ...state,
        loading: false
      });
    }
  };
  const { loading } = state;

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
        ) : (
          <GradientButton onPress={handleRequest} loading={loading}>
            {t(`community.memberPassport.connect`)}
          </GradientButton>
        )}

        {currentLocation || location || birthLocation || birthPlace ? (
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
            {birthPlace || birthLocation ? (
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
                  {`${birthPlace[0].state} ${birthPlace[0].country}`}
                </Paragraph>
              </Location>
            ) : null}
            {currentLocation || location ? (
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
