import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { AntDesign, SimpleLineIcons, Feather } from '@expo/vector-icons';
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
import { useThemeContext } from '../../../../../theme';
import hexToRGB from '../../../../../utils/hexToRGB';
import { GET_USER_DETAILS } from '../../../../../graphql/cache/query';
import { StoreInterface, RegistrationInfo } from '../../../../../graphql/types';
import Storage from '../../../../../libs/storage';
import { useQuery, useMutation } from '@apollo/react-hooks';
import formatMessageTime from '../../../../../utils/timesince';
import { ADD_USER_DETAILS } from '../../../../../graphql/cache/mutations';
import { GET_ALL_IDENTITIES } from '../../../../../graphql/server/query';
import { IdentitiesInterface } from '../../../../../graphql/types';
import IdentityModal from '../identityModal';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';
import { crashlytics } from '../../../../../firebase/config';

import {
  ContactContainer,
  FirstNameContainer,
  LastNameContainer,
  DOBContainer,
  Container,
  // TextInput,
  InterestContainer,
  IdentityContainer,
  Identities,
  IdentityText,
  LocationContainer,
  Location,
  CitizenshipContainer,
  AddIdentity,
  // LinkAccountsContainer,
  // InstagramButton,
  // SpotifyButton,
  // ButtonDot,
  EditTextInput
} from './styles';

export default function contactSlide() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { data: IdentityData } = useQuery<IdentitiesInterface>(
    GET_ALL_IDENTITIES
  );

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);

  const [userRegInfo, setUserRegInfo] = useState<RegistrationInfo | null>(null);

  const userDetails = data?.userDetails;

  const [isVisible, setIsVisible] = useState(false);

  const [state, setState] = useState<{
    date: string;
    editLastName: boolean;
    editFirstName: boolean;
    editBio: boolean;
    focusedBio: boolean;
    focusedFirstName: boolean;
    focusedLastName: boolean;
    showDatePicker: boolean;
    disableLastName: boolean;
    disableFirstName: boolean;
    disableBio: boolean;
    firstName: string | undefined;
    lastName: string | undefined;
    bio: string;
    selectedIdentity: [];
    selectedId: [];
  }>({
    date: '',
    bio: '',
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    editLastName: false,
    editFirstName: false,
    editBio: false,
    focusedFirstName: false,
    focusedLastName: false,
    focusedBio: false,
    showDatePicker: false,
    disableFirstName: true,
    disableLastName: true,
    disableBio: true,
    selectedIdentity: [],
    selectedId: []
  });

  const [location, setLocation] = useState<{
    currentLocation: {
      state: string | null | undefined;
      country: string | null | undefined;
      city: string | null | undefined;
      lat: number | null | undefined;
      long: number | null | undefined;
    };
    birthPlace: {
      state: string | null | undefined;
      country: string | null | undefined;
      city: string | null | undefined;
      lat: number | null | undefined;
      long: number | null | undefined;
    };
  }>({
    currentLocation: {
      state: '',
      country: '',
      city: '',
      lat: 0,
      long: 0
    },
    birthPlace: {
      state: '',
      country: '',
      city: '',
      lat: 0,
      long: 0
    }
  });

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

  const SelectedIdentitiesID = Array.from(state.selectedId.values());

  const newDate = state.date ? state.date : null;
  const dob = newDate?.split('/');

  const userIdentities = IdentityData?.Identity?.data
    ?.map((item: { name: string; id: string }) => {
      if (userDetails?.identity.includes(item.id)) {
        return item.name;
      }
    })
    .filter((item) => item !== undefined);

  const [addUserDetails] = useMutation(ADD_USER_DETAILS, {
    variables: {
      details: {
        bio: state.bio,
        firstName: state.firstName,
        lastName: state.lastName,
        dob: newDate
      }
    }
  });

  useEffect(() => {
    (async () => {
      const storageData = await Storage.getUserRegistration();

      if (storageData) {
        const regInfo = JSON.parse(storageData) as RegistrationInfo;
        setUserRegInfo({ ...userRegInfo, ...regInfo });
      }
    })();
  }, []);

  useEffect(() => {
    setState({
      ...state,
      firstName: userRegInfo?.user?.firstName,
      lastName: userRegInfo?.user?.lastName
    });
    setLocation({
      ...location,
      currentLocation: {
        state: userRegInfo?.user?.currentLocation?.state,
        country: userRegInfo?.user?.currentLocation?.country,
        city: userRegInfo?.user?.currentLocation?.city,
        lat: userRegInfo?.user?.currentLocation?.lat,
        long: userRegInfo?.user?.currentLocation?.long
      },
      birthPlace: {
        state: userRegInfo?.user?.birthPlace?.state,
        country: userRegInfo?.user?.birthPlace?.country,
        city: userRegInfo?.user?.birthPlace?.city,
        lat: userRegInfo?.user?.birthPlace?.lat,
        long: userRegInfo?.user?.birthPlace?.long
      }
    });
  }, [userRegInfo]);

  // const currentLocation =
  //   userDetails?.currentLocation[0] || location.currentLocation;
  // const birthPlace =
  //   userDetails?.birthPlace[0] || userRegInfo?.user?.birthPlace;

  const onChange = (selectedDate: Date) => {
    const newDate = formatMessageTime(selectedDate);
    const dob = newDate?.split('/');
    const day = parseInt(dob[0]);
    const month = parseInt(dob[1]);
    const year = parseInt(dob[2]);
    const date = month + '/' + day + '/' + year;
    setState({ ...state, date, showDatePicker: false });
    setTimeout(() => addUserDetails(), 0);
  };

  const handleDatePicker = () => {
    setState({ ...state, showDatePicker: !state.showDatePicker });
  };

  const {
    firstName,
    lastName,
    disableFirstName,
    disableLastName,
    bio,
    disableBio
  } = state;

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
          <EditTextInput
            underlayColor={hexToRGB(colors.PRIMARY_TEXT, 0.7)}
            onPress={() => setState({ ...state, disableFirstName: false })}
          >
            <Feather name="edit" size={RFValue(20)} color={colors.INACTIVE} />
          </EditTextInput>
        </FirstNameContainer>
        <TextInput
          ref={hideSensitiveView}
          value={firstName}
          onSubmitEditing={() => setTimeout(() => addUserDetails(), 0)}
          onChangeText={(firstName: string) =>
            setState({
              ...state,
              firstName,
              disableFirstName: false
            })
          }
          disabled={disableFirstName}
          onFocus={() => setState({ ...state, disableFirstName: false })}
          onBlur={() => setState({ ...state, disableFirstName: true })}
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            backgroundColor: colors.WHITE,
            borderBottomWidth: disableFirstName ? 0 : 2,
            borderColor: colors.PRIMARY,
            height: 30
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
          <EditTextInput
            underlayColor={hexToRGB(colors.PRIMARY_TEXT, 0.7)}
            onPress={() => setState({ ...state, disableLastName: false })}
          >
            <Feather name="edit" size={RFValue(20)} color={colors.INACTIVE} />
          </EditTextInput>
        </LastNameContainer>
        <TextInput
          ref={hideSensitiveView}
          value={lastName}
          onSubmitEditing={() => setTimeout(() => addUserDetails(), 0)}
          onChangeText={(lastName: string) =>
            setState({
              ...state,
              lastName,
              disableLastName: false
            })
          }
          disabled={disableLastName}
          onFocus={() => setState({ ...state, disableLastName: false })}
          onBlur={() => setState({ ...state, disableLastName: true })}
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            backgroundColor: colors.WHITE,
            borderBottomWidth: disableLastName ? 0 : 2,
            borderColor: colors.PRIMARY,
            height: 30
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
            {t(`signup.passportScreen.bio`)}
          </Title>
          <EditTextInput
            underlayColor={hexToRGB(colors.PRIMARY_TEXT, 0.7)}
            onPress={() => setState({ ...state, disableBio: false })}
          >
            <Feather name="edit" size={RFValue(20)} color={colors.INACTIVE} />
          </EditTextInput>
        </LastNameContainer>
        <TextInput
          ref={hideSensitiveView}
          value={bio}
          onSubmitEditing={() => setTimeout(() => addUserDetails(), 0)}
          onChangeText={(bio: string) =>
            setState({
              ...state,
              bio,
              disableBio: false
            })
          }
          placeholder={t(`signup.passportScreen.updateBio`)}
          disabled={disableBio}
          onFocus={() => setState({ ...state, disableBio: false })}
          onBlur={() => setState({ ...state, disableBio: true })}
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            backgroundColor: colors.WHITE,
            borderBottomWidth: disableBio ? 0 : 2,
            borderColor: colors.PRIMARY,
            height: 30
          }}
        />
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
          {t(`signup.passportScreen.dob`)}
        </Title>

        <Button
          ref={hideSensitiveView}
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

      {/* {userDetails?.birthPlace[0] || location.birthPlace.city ? (
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
            {location?.currentLocation.country ||
              userDetails?.currentLocation[0].country}
          </Paragraph>
        </CitizenshipContainer>
      ) : null} */}

      {userDetails?.currentLocation || location.currentLocation.state ? (
        <LocationContainer ref={hideSensitiveView}>
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
          {/* 
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
              {`${
                userDetails?.birthPlace[0].city || location.birthPlace.city
              }, ${
                userDetails?.birthPlace[0].state || location.birthPlace.state
              }`}
            </Paragraph>
          </Location> */}

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
              {`${
                userDetails?.currentLocation.city ||
                location.currentLocation.city
              }, ${
                userDetails?.currentLocation.state ||
                location.currentLocation.state
              }`}
            </Paragraph>
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
          {userDetails?.identity.length ? (
            <Fragment>
              {userIdentities?.map((identity, index) => (
                <IdentityText key={index}>{identity}</IdentityText>
              ))}
            </Fragment>
          ) : userRegInfo?.user?.identityName?.length ? (
            <Fragment>
              {userRegInfo?.user?.identityName?.map((identity, index) => (
                <IdentityText key={index}>{identity}</IdentityText>
              ))}
            </Fragment>
          ) : (
            <Fragment>
              {SelectedIdentities?.map((identity) => (
                <IdentityText key={identity}>{identity}</IdentityText>
              ))}
            </Fragment>
          )}
          <TouchableRipple onPress={showIdentityModal(true)}>
            <AddIdentity>+</AddIdentity>
          </TouchableRipple>
        </Identities>
      </IdentityContainer>

      {/* <InterestContainer>
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
      </InterestContainer> */}

      {/* <LinkAccountsContainer>
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
