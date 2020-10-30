import React, { useState, useCallback, Fragment, useEffect } from 'react';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import {
  Button,
  IconButton,
  Title,
  Paragraph,
  TextInput,
  TouchableRipple
} from 'react-native-paper';
import * as Sentry from '@sentry/react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import {
  MyPassportInterface,
  PassportInterface
} from '../../../../graphql/types';
import { useQuery } from '@apollo/react-hooks';
import formatMessageTime from '../../../../utils/timesince';
import { GET_USER_PASSPORT } from '../../../../graphql/server/query';
import IdentityModal from '../identityModal';
import ContactSlideSkeleton from './skeleton';
import Storage from '../../../../libs/storage';

import {
  ContactContainer,
  FirstNameContainer,
  LastNameContainer,
  DOBContainer,
  Container,
  InterestContainer,
  IdentityContainer,
  Identities,
  IdentityText,
  LocationContainer,
  Location,
  CitizenshipContainer,
  EditTextInput,
  AddIdentity,
  BioContainer
  // LinkAccountsContainer,
  // InstagramButton,
  // SpotifyButton,
  // ButtonDot,
} from './styles';
import { NavigationInterface } from '../../../types';
import { useNavigation } from '@react-navigation/native';

interface ScreenProp extends NavigationInterface {
  click: boolean;
  getUserDetails: any;
}

function contactSlide(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const click = props.click;

  const navigation = useNavigation();

  const { data: userData, loading } = useQuery<MyPassportInterface>(
    GET_USER_PASSPORT
  );
  const userDetails = userData?.myPassport;

  const [isVisible, setIsVisible] = useState(false);

  const [cache, setCache] = useState<PassportInterface | null>(null);

  const [state, setState] = useState<{
    date?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    disableBio: boolean;
    disableLastName: boolean;
    disableFirstName: boolean;
    showDatePicker: boolean;
    selectedIdentity: string[];
    selectedId: string[];
    birthPlace: {
      lat: number | null | undefined;
      long: number | null | undefined;
      country: string | null | undefined;
      state: string | null | undefined;
      city: string | null | undefined;
    };
    birthPlaceInput: string;
  }>({
    date: '',
    firstName: '',
    lastName: '',
    bio: '',
    disableBio: true,
    disableLastName: true,
    disableFirstName: true,
    showDatePicker: false,
    selectedIdentity: [],
    selectedId: [],
    birthPlace: {
      lat: 0,
      long: 0,
      country: '',
      state: '',
      city: ''
    },
    birthPlaceInput: ''
  });

  const currentLocation = userDetails?.currentLocation[0].country
    ? userDetails?.currentLocation[0]
    : cache?.currentLocation[0];

  useEffect(() => {
    (async () => {
      if (userDetails?.id.length) {
        await Storage.setUserPassport({ ...userDetails });
      }
    })();
  }, [userData]);

  useEffect(() => {
    (async () => {
      try {
        const passportInfo = await Storage.getUserPassport();
        setCache({
          ...cache,
          ...passportInfo
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (cache) {
      setState({
        ...state,
        date: `${cache?.dob?.month}/${cache?.dob?.day}/${cache?.dob?.year}`,
        firstName: cache?.firstName,
        lastName: cache?.lastName,
        bio: cache?.bio,
        birthPlace: {
          lat: cache?.birthPlace[0]?.lat,
          long: cache?.birthPlace[0]?.long,
          country: cache?.birthPlace[0]?.country,
          state: cache?.birthPlace[0]?.state,
          city: cache?.birthPlace[0]?.city
        }
      });
    }
  }, [cache]);

  useEffect(() => {
    if (loading) return;
    setState({
      ...state,
      date: `${userDetails?.dob?.month}/${userDetails?.dob?.day}/${userDetails?.dob?.year}`,
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      bio: userDetails?.bio,
      birthPlace: {
        lat: userDetails?.birthPlace[0]?.lat,
        long: userDetails?.birthPlace[0]?.long,
        country: userDetails?.birthPlace[0]?.country,
        state: userDetails?.birthPlace[0]?.state,
        city: userDetails?.birthPlace[0]?.city
      }
    });
  }, [userData?.myPassport.id]);

  const getBirthplaceDetails = (childData: any) => {
    setState({
      ...state,
      date: `${userDetails?.dob?.month}/${userDetails?.dob?.day}/${userDetails?.dob?.year}`,
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      bio: userDetails?.bio,
      birthPlace: {
        lat: childData?.lat,
        long: childData?.long,
        country: childData?.country,
        state: childData?.state,
        city: childData?.city
      }
    });
  };

  const handleNavigation = useCallback(() => {
    navigation.navigate('BirthPlaceScreen', {
      details: state,
      getBirthplaceDetails: getBirthplaceDetails
    });
  }, []);

  const onChange = (selectedDate: Date) => {
    const newDate = formatMessageTime(selectedDate);
    const dob = newDate?.split('/');
    const day = parseInt(dob[0]);
    const month = parseInt(dob[1]);
    const year = parseInt(dob[2]);
    const date = month + '/' + day + '/' + year;
    return setState({ ...state, date, showDatePicker: false });
  };

  const handleDatePicker = () => {
    setState({ ...state, showDatePicker: !state.showDatePicker });
  };

  const showIdentityModal = useCallback(
    (isVisible: boolean) => () => {
      setIsVisible(isVisible);

      return true;
    },
    []
  );

  const getIdentity = (childData: any, idData: any) => {
    setState({
      ...state,
      selectedIdentity: childData,
      selectedId: idData
    });
  };

  const SelectedIdentities = Array.from(state.selectedIdentity.values());

  const { firstName, lastName, bio, birthPlace } = state;

  useEffect(() => {
    props.getUserDetails(state);
  }, [state]);

  return (
    <ContactContainer>
      <Container>
        <FirstNameContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'uppercase'
            }}
          >
            {t(`signup.passportScreen.firstName`)}
          </Title>
        </FirstNameContainer>
        <TextInput
          value={firstName}
          onChangeText={(firstName: string) =>
            setState({
              ...state,
              firstName
            })
          }
          disabled={click}
          style={{
            height: 30,
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            backgroundColor: colors.WHITE,
            borderBottomWidth: click ? 0 : 2,
            borderColor: colors.PRIMARY,
            textTransform: 'capitalize'
          }}
        />
      </Container>

      <Container>
        <LastNameContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'uppercase'
            }}
          >
            {t(`signup.passportScreen.lastName`)}
          </Title>
        </LastNameContainer>
        <TextInput
          value={lastName}
          onChangeText={(lastName: string) =>
            setState({
              ...state,
              lastName
            })
          }
          disabled={click}
          style={{
            height: 30,
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            backgroundColor: colors.WHITE,
            borderBottomWidth: click ? 0 : 2,
            borderColor: colors.PRIMARY,
            textTransform: 'capitalize'
          }}
        />
      </Container>

      <Container>
        <BioContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'uppercase'
            }}
          >
            {t(`community.memberPassport.bio`)}
          </Title>
        </BioContainer>
        {bio ? (
          <TextInput
            value={bio}
            multiline={true}
            dense={true}
            onChangeText={(bio: string) =>
              setState({
                ...state,
                bio: bio
              })
            }
            disabled={click}
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              color: colors.PRIMARY_TEXT,
              backgroundColor: colors.WHITE,
              borderBottomWidth: click ? 0 : 2,
              borderColor: colors.PRIMARY,
              textTransform: 'capitalize'
            }}
          />
        ) : (
          <TextInput
            placeholder={t(`community.memberPassport.bioInfo`)}
            multiline={true}
            dense={true}
            onChangeText={(bio: string) =>
              setState({
                ...state,
                bio: bio
              })
            }
            disabled={click}
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              color: colors.PRIMARY_TEXT,
              backgroundColor: colors.WHITE,
              borderBottomWidth: click ? 0 : 2,
              borderColor: colors.PRIMARY,
              textTransform: 'capitalize'
            }}
          />
        )}
      </Container>

      <DOBContainer>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase',
            marginBottom: 0
          }}
        >
          {t(`community.memberPassport.dob`)}
        </Title>

        <Button
          mode="text"
          uppercase={false}
          labelStyle={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            paddingTop: 5,
            paddingBottom: 5,
            marginTop: 0,
            marginLeft: 0
          }}
          contentStyle={{ justifyContent: 'flex-start', borderRadius: 4 }}
          onPress={handleDatePicker}
        >
          {state.date ? state.date : t(`signup.passportScreen.dob`)}
        </Button>

        <DateTimePicker
          isVisible={state.showDatePicker}
          mode="date"
          onConfirm={onChange}
          onCancel={handleDatePicker}
          maximumDate={new Date()}
        />
      </DOBContainer>

      {birthPlace?.country ? (
        <CitizenshipContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'uppercase'
            }}
          >
            {t(`signup.passportScreen.citizenship`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {birthPlace?.country}
          </Paragraph>
        </CitizenshipContainer>
      ) : null}

      {currentLocation ? (
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
            {!click ? (
              <Fragment>
                {userDetails?.birthPlace[0]?.city ||
                cache?.birthPlace[0]?.city ? (
                  <TouchableRipple
                    style={{
                      flex: 1,
                      borderBottomWidth: 2,
                      borderColor: colors.PRIMARY
                    }}
                    onPress={handleNavigation}
                  >
                    <Paragraph
                      style={{
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                        color: colors.PRIMARY_TEXT,
                        backgroundColor: colors.WHITE,
                        textTransform: 'capitalize'
                      }}
                    >
                      {`${birthPlace?.city}, ${birthPlace?.state}`}
                    </Paragraph>
                  </TouchableRipple>
                ) : (
                  <TouchableRipple
                    style={{
                      flex: 1,
                      borderBottomWidth: 2,
                      borderColor: colors.PRIMARY
                    }}
                    onPress={handleNavigation}
                  >
                    <Paragraph
                      style={{
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                        color: colors.PRIMARY_TEXT,
                        backgroundColor: colors.WHITE,
                        textTransform: 'capitalize'
                      }}
                    >
                      {`${birthPlace?.state}, ${birthPlace?.country}`}
                    </Paragraph>
                  </TouchableRipple>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {userDetails?.birthPlace[0]?.city ? (
                  <Paragraph
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginBottom: 10
                    }}
                  >
                    {`${birthPlace?.city}, ${birthPlace?.state}`}
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
                    {`${birthPlace?.state}, ${birthPlace?.country}`}
                  </Paragraph>
                )}
              </Fragment>
            )}
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
            {userDetails?.currentLocation[0]?.city ||
            cache?.currentLocation[0]?.city ? (
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  marginBottom: 10
                }}
              >
                {`${currentLocation?.city}, ${currentLocation.state}`}
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
                {`${currentLocation.state}, ${currentLocation.country}`}
              </Paragraph>
            )}
          </Location>
        </LocationContainer>
      ) : null}

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
          {SelectedIdentities?.length ? (
            <Fragment>
              {SelectedIdentities.map((identity) => (
                <IdentityText key={identity}>{identity}</IdentityText>
              ))}
            </Fragment>
          ) : (
            <Fragment>
              {userDetails?.identity.map((identity: any) => (
                <IdentityText key={identity.id}>{identity.name}</IdentityText>
              ))}
            </Fragment>
          )}
          <TouchableRipple onPress={showIdentityModal(true)}>
            <AddIdentity>+</AddIdentity>
          </TouchableRipple>
        </Identities>
      </IdentityContainer>

      {userDetails?.interest.length ? (
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
          <IconButton
            onPress={() => console.log('Pressed')}
            icon="plus"
            color={colors.PRIMARY_TEXT}
            size={20}
            style={{
              width: RFValue(50),
              height: RFValue(40),
              borderRadius: 4,
              margin: 0,
              marginTop: 10,
              borderColor: colors.INACTIVE,
              borderWidth: RFValue(1.2)
            }}
          />
        </InterestContainer>
      ) : null}

      {/* 
      <LinkAccountsContainer>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase',
            marginTop: 10
          }}
        >
          {t(`signup.passportScreen.linkAccounts`)}
        </Title>

        <InstagramButton
          underlayColor={colors.DISABLED}
          onPress={() => console.log('ON PRESS')}
        >
          <Fragment>
            <FontAwesome
              name="instagram"
              size={RFValue(30)}
              color={colors.WHITE}
            />
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 4),
                color: colors.WHITE,
                textTransform: 'capitalize'
              }}
            >
              {t(`signup.passportScreen.instagramTitle`)}
            </Title>
            <ButtonDot />
          </Fragment>
        </InstagramButton>

        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
            color: colors.PRIMARY_TEXT,
            marginBottom: 10
          }}
        >
          {t(`signup.passportScreen.instagramSubTitle`)}
        </Paragraph>

        <SpotifyButton
          underlayColor={colors.DISABLED}
          onPress={() => console.log('ON PRESS')}
        >
          <Fragment>
            <FontAwesome
              name="spotify"
              size={RFValue(30)}
              color={colors.WHITE}
            />
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 4),
                color: colors.WHITE,
                textTransform: 'capitalize'
              }}
            >
              {t(`signup.passportScreen.spotifyTitle`)}
            </Title>
            <ButtonDot />
          </Fragment>
        </SpotifyButton>

        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
            color: colors.PRIMARY_TEXT
          }}
        >
          {t(`signup.passportScreen.spotifySubTitle`)}
        </Paragraph>
      </LinkAccountsContainer>
     */}

      <IdentityModal
        isVisible={isVisible}
        closeIdentityModal={showIdentityModal(false)}
        identity={getIdentity}
      />
    </ContactContainer>
  );
}

export default React.memo(contactSlide);
