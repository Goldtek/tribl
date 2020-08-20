import React, { useState, useRef, useCallback } from 'react';
import { AntDesign, SimpleLineIcons, Feather } from '@expo/vector-icons';
import { Button, IconButton, Title, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import hexToRGB from '../../../../utils/hexToRGB';
import { MyPassportInterface } from '../../../../graphql/types';
import { useQuery } from '@apollo/react-hooks';
import formatMessageTime from '../../../../utils/timesince';
import { GET_USER_PASSPORT } from '../../../../graphql/server/query';

import {
  ContactContainer,
  FirstNameContainer,
  LastNameContainer,
  DOBContainer,
  Container,
  TextInput,
  InterestContainer,
  IdentityContainer,
  Identities,
  IdentityText,
  LocationContainer,
  Location,
  CitizenshipContainer,
  EditTextInput
  // LinkAccountsContainer,
  // InstagramButton,
  // SpotifyButton,
  // ButtonDot,
} from './styles';
import formatMessageTime from '../../../../utils/timesince';

export default function contactSlide() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;

  const currentLocation = userDetails?.currentLocation[0];
  const birthPlace = userDetails?.birthPlace[0];

  const [state, setState] = useState({
    date: userDetails?.dob,
    firstName: '',
    lastName: '',
    editLastName: false,
    editFirstName: false,
    focusedFirstName: false,
    focusedLastName: false,
    showDatePicker: false
  });

  const inputRef = useRef({ firstName: {}, lastName: {} }) as any;

  const onChange = useCallback((selectedDate: Date) => {
    const date = formatMessageTime(selectedDate);
    return setState({ ...state, date, showDatePicker: false });
  }, []);

  const handleDatePicker = useCallback(() => {
    setState({ ...state, showDatePicker: !state.showDatePicker });
  }, [state.showDatePicker]);

  const handleRefControl = useCallback(
    (edit: string, focus: string) => () => {
      setState({ ...state, [edit]: true });
      inputRef.current[focus].focus();
    },
    []
  );

  const handleInputFocus = useCallback(
    (inputField: string) => () => {
      //@ts-ignore
      setState({ ...state, [inputField]: !state[inputField] });
    },
    []
  );

  const onChangeText = useCallback(
    (inputFieldLabel: string) => (value: string) => {
      setState({ ...state, [inputFieldLabel]: value });
    },
    []
  );

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
            onPress={handleRefControl('editFirstName', 'firstName')}
          >
            <Feather name="edit" size={RFValue(20)} color={colors.INACTIVE} />
          </EditTextInput>
        </FirstNameContainer>
        <TextInput
          ref={(e) => (inputRef.current.firstName = e)}
          value={userDetails?.firstName}
          editable={state.editFirstName}
          onChangeText={onChangeText('firstName')}
          onFocus={handleInputFocus('focusedFirstName')}
          onBlur={handleInputFocus('focusedFirstName')}
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            borderBottomWidth: 2,
            borderBottomColor: state.focusedFirstName
              ? colors.PRIMARY
              : colors.WHITE
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
            onPress={handleRefControl('editLastName', 'lastName')}
          >
            <Feather name="edit" size={RFValue(20)} color={colors.INACTIVE} />
          </EditTextInput>
        </LastNameContainer>
        <TextInput
          ref={(e) => (inputRef.current.lastName = e)}
          value={userDetails?.lastName}
          editable={state.editLastName}
          onChangeText={onChangeText('lastName')}
          onFocus={handleInputFocus('focusedLastName')}
          onBlur={handleInputFocus('focusedLastName')}
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            borderBottomWidth: 2,
            borderBottomColor: state.focusedLastName
              ? colors.PRIMARY
              : colors.WHITE
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

      {userDetails?.identity.length ? (
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
            {userDetails?.identity.map((identity) => (
              <IdentityText key={identity}>{identity}</IdentityText>
            ))}
          </Identities>
        </IdentityContainer>
      ) : null}

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
    </ContactContainer>
  );
}
