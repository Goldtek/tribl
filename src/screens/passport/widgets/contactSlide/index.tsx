// @ts-nocheck
import React, { useState, useCallback, Fragment, useEffect } from 'react';
import { SimpleLineIcons, Feather } from '@expo/vector-icons';
import {
  Button,
  Title,
  Paragraph,
  TextInput,
  TouchableRipple
} from 'react-native-paper';
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
import IdentityModal, { IdentityInterface } from '../identityModal';
import InterestModal from '../interestModal';
import Storage from '../../../../libs/storage';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';
import { NavigationInterface } from '../../../types';
import { userDetails as cacheData } from '../../../../graphql/cache';
import { InterestsInterface } from '../interestModal/interestButton';

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
  AddIdentity,
  BioContainer
  // LinkAccountsContainer,
  // InstagramButton,
  // SpotifyButton,
  // ButtonDot,
} from './styles';

interface ScreenProp extends NavigationInterface {
  click: boolean;
  getUserDetails(state: any): void;
}

function ContactSlide(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const click = props.click;

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const [isVisible, setIsVisible] = useState(false);
  const [interestVisible, setInterestVisible] = useState(false);

  const [state, setState] = useState<{
    date?: string | Date | number;
    timeStamp?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    disableBio: boolean;
    disableLastName: boolean;
    disableFirstName: boolean;
    showDatePicker: boolean;
    birthPlaceInput: string;
    selectedIdentity: IdentityInterface[];
    selectedInterest: InterestsInterface[];
  }>({
    ...cacheData,
    date: '',
    firstName: '',
    timeStamp: '',
    lastName: '',
    bio: '',
    disableBio: true,
    disableLastName: true,
    disableFirstName: true,
    showDatePicker: false,
    selectedIdentity: [],
    birthPlaceInput: '',
    selectedInterest: []
  });

  const currentLocation = state?.currentLocation;

  const [select, setSelect] = useState({
    identity: [],
    interest: []
  });

  useEffect(() => {
    if (state.selectedIdentity) {
      setSelect({
        ...select,
        identity: state?.selectedIdentity
      });
    }
    if (state.selectedInterest) {
      setSelect({
        ...select,
        interest: state?.selectedInterest
      });
    }
  }, [state.selectedIdentity || state.selectedInterest]);

  const handleSelectIdentity = (selected: string) => {
    const filteredIdentity = select.identity.filter(
      (identity) => identity.name !== selected
    );
    setSelect({
      ...select,
      identity: filteredIdentity
    });
  };

  const handleSelectInterest = (selected: string) => {
    const filteredInterest = select.interest.filter(
      (interest) => interest.name !== selected
    );
    setSelect({
      ...select,
      interest: filteredInterest
    });
  };

  useEffect(() => {
    (async () => {
      if (userDetails) {
        await Storage.setUserPassport({ ...userDetails });
        setSelect({
          ...select,
          identity: userDetails?.identity,
          interest: userDetails?.interest
        });
        setState({
          ...state,
          ...userDetails,
          date: new Date(parseInt(userDetails?.dob))
            .toLocaleString()
            .split(',')[0]
        });
      }
    })();
  }, [userDetails]);

  useEffect(() => {
    (async () => {
      const storageData = await Storage.getUserPassport();

      if (storageData) {
        const passportInfo = JSON.parse(storageData) as PassportInterface;
        setState({
          ...state,
          ...passportInfo,
          date: new Date(parseInt(passportInfo?.dob))
            .toLocaleString()
            .split(',')[0]
        });
      }
    })();
  }, []);

  const onChange = (selectedDate: Date) => {
    const newDate = formatMessageTime(selectedDate);
    const dob = newDate?.split('/');
    const day = parseInt(dob[0]);
    const month = parseInt(dob[1]);
    const year = parseInt(dob[2]);
    const dobTimestamp = new Date(Date.UTC(year, month - 1, day));
    const timeStamp = dobTimestamp / 1000;
    const date = month + '/' + day + '/' + year;
    return setState({ ...state, date, showDatePicker: false, timeStamp });
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

  const showInterestModal = useCallback(
    (interest: boolean) => () => {
      setInterestVisible(interest);
      return true;
    },
    []
  );

  const getIdentity = (identity: IdentityInterface, action: string) => {
    if (action === 'addIdentity') {
      return setState({
        ...state,
        selectedIdentity: [...state.selectedIdentity, identity]
      });
    }

    let filteredIdentity = state.selectedIdentity.filter(
      (value) => value !== identity
    );
    setState({
      ...state,
      selectedIdentity: filteredIdentity
    });
  };

  const getInterest = (interest: InterestsInterface, action: string) => {
    if (action === 'addInterest') {
      setState({
        ...state,
        selectedInterest: [...state.selectedInterest, interest]
      });
    }

    let filteredInterest = state.selectedInterest.filter(
      (value) => value !== interest
    );
    setState({
      ...state,
      selectedInterest: filteredInterest
    });
  };

  const { firstName, lastName, bio } = state;

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
          ref={hideSensitiveView}
          value={firstName}
          onChangeText={(firstName: string) =>
            setState({ ...state, firstName })
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
          ref={hideSensitiveView}
          value={lastName}
          onChangeText={(lastName: string) => setState({ ...state, lastName })}
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
            ref={hideSensitiveView}
            value={bio}
            multiline={true}
            dense={true}
            onChangeText={(bio: string) => setState({ ...state, bio })}
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
            ref={hideSensitiveView}
            placeholder={t(`community.memberPassport.bioInfo`)}
            multiline={true}
            dense={true}
            onChangeText={(bio: string) => setState({ ...state, bio: bio })}
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
          ref={hideSensitiveView}
          mode="text"
          uppercase={false}
          disabled={click}
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
          {!state.date || state.date == 'Invalid Date'
            ? t(`signup.passportScreen.dob`)
            : state.date}
        </Button>

        <DateTimePicker
          isVisible={state.showDatePicker}
          mode="date"
          onConfirm={onChange}
          onCancel={handleDatePicker}
          maximumDate={new Date()}
        />
      </DOBContainer>

      {/* {birthPlace?.country ? (
        <CitizenshipContainer ref={hideSensitiveView}>
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
      ) : null} */}

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

          {/* <Location>
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
                    ref={hideSensitiveView}
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
                    ref={hideSensitiveView}
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
              <Cover ref={hideSensitiveView}>
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
              </Cover>
            )}
          </Location> */}

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
          </Location>
        </LocationContainer>
      ) : null}
      {state?.selectedIdentity?.length ||
      userDetails?.identity?.length ||
      !click ? (
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
            <Fragment>
              {select.identity.map((identity) => (
                <IdentityText
                  key={identity.id}
                  onPress={() => handleSelectIdentity(identity.name)}
                >
                  {identity.name}
                  {!click ? (
                    <Fragment>
                      {' '}
                      <Feather
                        onPress={() => handleSelectIdentity(identity.name)}
                        name="x"
                        size={RFValue(13)}
                        color={colors.PRIMARY_TEXT}
                        style={{
                          paddingLeft: RFValue(30),
                          paddingRight: RFValue(50)
                        }}
                      />
                    </Fragment>
                  ) : null}
                </IdentityText>
              ))}
            </Fragment>

            {!click ? (
              <TouchableRipple onPress={showIdentityModal(true)}>
                <AddIdentity>+</AddIdentity>
              </TouchableRipple>
            ) : null}
          </Identities>
        </IdentityContainer>
      ) : null}

      {state.selectedIdentity?.length ||
      userDetails?.interest?.length ||
      !click ? (
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
            <Fragment>
              {select?.interest.map((interest) => (
                <IdentityText key={interest.id}>
                  {interest.name}
                  {!click ? (
                    <Fragment>
                      {' '}
                      <Feather
                        onPress={() => handleSelectInterest(interest.name)}
                        name="x"
                        size={RFValue(13)}
                        color={colors.PRIMARY_TEXT}
                        style={{
                          paddingLeft: RFValue(30),
                          paddingRight: RFValue(50)
                        }}
                      />
                    </Fragment>
                  ) : null}
                </IdentityText>
              ))}
            </Fragment>

            {!click ? (
              <TouchableRipple onPress={showInterestModal(true)}>
                <AddIdentity>+</AddIdentity>
              </TouchableRipple>
            ) : null}
          </Identities>
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

      <InterestModal
        isVisible={interestVisible}
        closeIdentityModal={showInterestModal(false)}
        interest={getInterest}
      />
    </ContactContainer>
  );
}

export default React.memo(ContactSlide);
