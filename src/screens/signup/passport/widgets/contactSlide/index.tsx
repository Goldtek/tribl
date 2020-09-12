import React, { Fragment, useState, useCallback } from 'react';
import { AntDesign, SimpleLineIcons, Feather } from '@expo/vector-icons';
import {
  Button,
  IconButton,
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
import { StoreInterface } from '../../../../../graphql/types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import formatMessageTime from '../../../../../utils/timesince';
import { ADD_USER_DETAILS } from '../../../../../graphql/cache/mutations';
import IdentityModal from '../identityModal';

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

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);
  const userDetails = data?.userDetails;

  const [isVisible, setIsVisible] = useState(false);

  const [state, setState] = useState<{
    date: Date | null;
    editLastName: boolean;
    editFirstName: boolean;
    focusedFirstName: boolean;
    focusedLastName: boolean;
    showDatePicker: boolean;
    disableLastName: boolean;
    disableFirstName: boolean;
    firstName: string | undefined;
    lastName: string | undefined;
    selectedIdentity: [];
    selectedId: [];
  }>({
    date: null,
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    editLastName: false,
    editFirstName: false,
    focusedFirstName: false,
    focusedLastName: false,
    showDatePicker: false,
    disableFirstName: true,
    disableLastName: true,
    selectedIdentity: [],
    selectedId: []
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

  const newDate = state.date ? formatMessageTime(state.date) : null;
  const dob = newDate?.split('/');
  const day = dob?.length ? parseInt(dob[0]) : null;
  const month = dob?.length ? parseInt(dob[1]) : null;
  const year = dob?.length ? parseInt(dob[2]) : null;

  const [addUserDetails] = useMutation(ADD_USER_DETAILS, {
    variables: {
      details: {
        firstName: state.firstName,
        lastName: state.lastName,
        dob: {
          day: day,
          month: month,
          year: year,
          __typename: 'dateOfBirth'
        },
        identity: SelectedIdentitiesID
      }
    }
  });

  const currentLocation = userDetails?.currentLocation[0];
  const birthPlace = userDetails?.birthPlace[0];

  const onChange = (date: Date) => {
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
    date
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
          value={firstName}
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
          value={lastName}
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
          {state.date
            ? formatMessageTime(state.date)
            : t(`signup.passportScreen.dob`)}
        </Button>

        <DateTimePicker
          isVisible={state.showDatePicker}
          mode="date"
          onConfirm={onChange}
          onCancel={handleDatePicker}
          maximumDate={new Date()}
        />
      </DOBContainer>

      {birthPlace ? (
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

      {currentLocation && birthPlace ? (
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
              {`${birthPlace.state} ${birthPlace.country}`}
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
              {`${currentLocation.state} ${currentLocation.country}`}
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
              {userDetails.identity.map((identity) => (
                <IdentityText key={identity}>{identity}</IdentityText>
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
