import React, { Fragment, useState, useRef } from 'react';
import {
  AntDesign,
  SimpleLineIcons,
  FontAwesome,
  Feather
} from '@expo/vector-icons';
import { Button, IconButton, Title, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import hexToRGB from '../../../../../utils/hexToRGB';
import { GET_USER_DETAILS } from '../../../../../graphql/cache/query';
import { StoreInterface } from '../../../../../graphql/types';
import { useQuery } from '@apollo/react-hooks';

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
  LinkAccountsContainer,
  InstagramButton,
  SpotifyButton,
  ButtonDot,
  EditTextInput
} from './styles';

export default function contactSlide() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    date: '',
    editLastName: false,
    editFirstName: false,
    focusedFirstName: false,
    focusedLastName: false,
    showDatePicker: false
  });

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);
  const userDetails = data?.userDetails;

  const inputRef = useRef({ firstName: {}, lastName: {} }) as any;

  const onChange = (selectedDate: Date) => {
    const date = `${selectedDate
      .toLocaleDateString()
      .substring(0, 6)}/${selectedDate?.getFullYear()}`;

    return setState({ ...state, date, showDatePicker: false });
  };

  const handleDatePicker = () => {
    setState({ ...state, showDatePicker: !state.showDatePicker });
  };

  const handleRefControl = (edit: string, focus: string) => () => {
    setState({ ...state, [edit]: true });
    inputRef.current[focus].focus();
  };

  const handleInputFocus = (inputField: string) => () => {
    //@ts-ignore
    setState({ ...state, [inputField]: !state[inputField] });
  };

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
            {t(`signup.screenEight.firstName`)}
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
          onChangeText={(text) => console.log({ text })}
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
            {t(`signup.screenEight.lastName`)}
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
          onChangeText={(text) => console.log({ text })}
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
          {t(`signup.screenEight.DOB`)}
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
          {state.date ? state.date : t(`signup.screenEight.DOB`)}
        </Button>

        <DateTimePicker
          isVisible={state.showDatePicker}
          mode="date"
          onConfirm={onChange}
          onCancel={handleDatePicker}
          maximumDate={new Date()}
        />
      </DOBContainer>

      <CitizenshipContainer>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase'
          }}
        >
          {t(`signup.screenEight.citizenship`)}
        </Title>

        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize'
          }}
        >
          {userDetails?.birthPlace.country
            ? userDetails?.birthPlace.country
            : 'empty'}
        </Paragraph>
      </CitizenshipContainer>

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
          {t(`signup.screenEight.locality`)}
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
            {userDetails?.birthPlace.state
              ? `${userDetails?.birthPlace.state} ${userDetails?.birthPlace.country}`
              : 'empty'}
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
            {userDetails?.currentLocation.state
              ? `${userDetails?.currentLocation.state} ${userDetails?.currentLocation.country}`
              : 'empty'}
          </Paragraph>
        </Location>
      </LocationContainer>

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
          {t(`signup.screenEight.identity`)}
        </Title>

        <Identities>
          {userDetails?.identities.length ? (
            userDetails?.identities.map((identity) => (
              <IdentityText key={identity}>{identity}</IdentityText>
            ))
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
              empty
            </Paragraph>
          )}
        </Identities>
      </IdentityContainer>

      <InterestContainer>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase'
          }}
        >
          {t(`signup.screenEight.interest`)}
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
          {t(`signup.screenEight.linkAccounts`)}
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
              {t(`signup.screenEight.instagramTitle`)}
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
          {t(`signup.screenEight.instagramSubTitle`)}
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
              {t(`signup.screenEight.spotifyTitle`)}
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
          {t(`signup.screenEight.spotifySubTitle`)}
        </Paragraph>
      </LinkAccountsContainer>
    </ContactContainer>
  );
}
