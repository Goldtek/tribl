// @ts-nocheck
import React, { useState, useCallback, Fragment, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { Button, Title, TextInput, TouchableRipple } from 'react-native-paper';
import { FlatList, TouchableHighlight, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../theme';
import {
  MyPassportInterface,
  PassportInterface,
  CommunityInterface,
  ChannelInterface
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
import MyConnectionCard from '../../../../components/MyConnectionCard';
import MyCommunity from '../../../../components/myCommunities';
import MyChannel from '../../../community/memberPassport/widget/channelCard';

import {
  Cover,
  Container,
  Identities,
  AddIdentity,
  DOBContainer,
  IdentityText,
  BioContainer,
  ContactContainer,
  LastNameContainer,
  IdentityContainer,
  InterestContainer,
  FirstNameContainer,
  CitizenshipContainer
  // LinkAccountsContainer,
  // LocationContainer,
  // InstagramButton,
  // SpotifyButton,
  // TitleCover,
  // ButtonDot,
  // Location,
} from './styles';

interface ScreenProp extends NavigationInterface {
  click: boolean;
  getUserDetails(state: any, select: any): void;
}

function ContactSlide(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const click = props.click;
  const navigation = useNavigation();
  const selectedCountry = props?.selectedCountries;
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
    selectedInterest: IdentityInterface[];
    tags: Map<string, unknown>;
    click: boolean;
    tagText: string;
    citizenship: [{ name: string; flag: string }];
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
    selectedInterest: [],
    tags: new Map(),
    click: false,
    tagText: '',
    citizenship: []
  });

  const [displayInterest, setDisplayInterest] = useState(false);

  const participantOf = state?.participantOf;
  const myConnections = state?.myConnections;
  const currentLocation = state?.currentLocation;
  const myChannels = state?.recentChannels;

  const _renderMyConnectionItem = ({ item }: { item: PassportInterface }) => (
    <MyConnectionCard key={item.id} {...item} singlePassport={state} />
  );

  const _renderMyCommunityItem = ({ item }: { item: CommunityInterface }) => (
    <MyCommunity key={item.id} {...item} singlePassport={state} />
  );

  const _renderMyChannelItem = ({ item }: { item: ChannelInterface }) => (
    <MyChannel key={item.id} {...item} singlePassport={state} />
  );

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
    if (state.tags?.length) {
      setSelect({
        ...select,
        interest: [...Array.from(state.tags.values())]
      });
    }
  }, [state.selectedIdentity || state.tags]);

  useEffect(() => {
    if (selectedCountry?.length) {
      setState({
        ...state,
        citizenship: selectedCountry
      });
    }
  }, [selectedCountry]);

  const handleSelectIdentity = (selected: string) => {
    const filteredIdentity = select.identity.filter(
      (identity) => identity.name !== selected
    );
    setSelect({
      ...select,
      identity: filteredIdentity
    });
  };

  const interest = userDetails?.interest.map((tag) => tag.name);

  useEffect(() => {
    (async () => {
      if (userDetails) {
        await Storage.setUserPassport({ ...userDetails });
        setSelect({
          ...select,
          identity: userDetails?.identity,
          interest: interest
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
        const interest = passportInfo?.interest?.map((tag) => tag.name);
        setState({
          ...state,
          ...passportInfo,
          date: new Date(parseInt(passportInfo?.dob))
            .toLocaleString()
            .split(',')[0]
        });
        setSelect({
          ...select,
          identity: passportInfo?.identity,
          interest: interest
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (select?.interest) {
      setState({
        ...state,
        selectedInterest: select.interest
      });
    }
  }, [select.interest]);

  const onChange = (selectedDate: Date) => {
    const newDate = formatMessageTime(selectedDate);
    const dob = newDate?.split('/');
    const day = parseInt(dob[0]);
    const month = parseInt(dob[1]);
    const year = parseInt(dob[2]);
    const dobTimestamp = new Date(Date.UTC(year, month - 1, day));
    const timeStamp = dobTimestamp / 1000;
    const date = month + '/' + day + '/' + year;
    const newDOB = year + '-' + month + '-' + day;
    if (date.includes('NaN')) {
      return setState({
        ...state,
        showDatePicker: false
      });
    }

    return setState({
      ...state,
      date,
      showDatePicker: false,
      timeStamp,
      dob: newDOB
    });
  };

  const handleDatePicker = () => {
    setState({ ...state, showDatePicker: !state.showDatePicker });
  };

  const handleSelectInterest = (selected: string) => {
    if (state.tags || !state.tags.has || !state.tags.has(selected)) {
      const tags = new Map();
      tags.set(selected, selected);
      setState({
        ...state,
        tags: tags,
        click: false,
        tagText: ''
      });
      setSelect({
        ...select,
        interest: [...select.interest, tags.get(selected)]
      });
      return setState({
        ...state,
        click: false,
        tagText: ''
      });
    }
  };

  const handleADeleteInterest = (selected: string) => {
    const filteredInterest = select.interest.filter(
      (interest) => interest !== selected
    );
    setSelect({
      ...select,
      interest: filteredInterest
    });
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

  const { firstName, lastName, bio, citizenship } = state;

  useEffect(() => {
    props.getUserDetails(state, select);
  }, [state || select]);

  return (
    <ContactContainer>
      {!click ? (
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
      ) : null}
      {!click ? (
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
            onChangeText={(lastName: string) =>
              setState({ ...state, lastName })
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
      ) : null}
      {!click ? (
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
      ) : (
        <Fragment>
          {bio ? (
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {bio}
            </Title>
          ) : null}
        </Fragment>
      )}
      {!click ? (
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
      ) : null}
      {!click ? (
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
          {citizenship?.length ? (
            <Fragment>
              {citizenship?.map((country) => (
                <Title
                  style={{
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                    color: colors.PRIMARY_TEXT
                  }}
                >
                  {country.name}
                </Title>
              ))}
            </Fragment>
          ) : null}
          {!click ? (
            <TouchableRipple
              onPress={() => navigation.navigate('CitizenshipScreen')}
            >
              <AddIdentity>+</AddIdentity>
            </TouchableRipple>
          ) : null}
        </CitizenshipContainer>
      ) : null}
      {/* {currentLocation ? (
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
              <Fragment ref={hideSensitiveView}>
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
      ) : null} */}
      {select.identity?.length || !click ? (
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
      {select?.interest?.length || state?.interest?.length || !click ? (
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
            {select?.interest?.length > 8 ||
            (state?.interest?.length > 8 && click) ? (
              <Fragment>
                {select?.interest?.length ? (
                  <Fragment>
                    {select?.interest?.slice(0, 8)?.map((tag) => (
                      <IdentityText
                        key={tag}
                        onPress={() =>
                          !click ? handleADeleteInterest(tag) : {}
                        }
                        style={{
                          marginRight: RFValue(10),
                          marginTop: RFValue(10),
                          borderColor: colors.INACTIVE,
                          borderWidth: 1.2,
                          borderRadius: 4,
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}
                        labelStyle={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: fonts.MEDIUM_SIZE,
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'capitalize'
                        }}
                      >
                        {tag}
                        {!click ? (
                          <Fragment>
                            <Feather
                              onPress={() => handleADeleteInterest(tag)}
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
                ) : (
                  <Fragment>
                    {state?.interest?.slice(0, 8)?.map((tag) => (
                      <IdentityText
                        key={tag.name}
                        onPress={() =>
                          !click ? handleADeleteInterest(tag.name) : {}
                        }
                        style={{
                          marginRight: RFValue(10),
                          marginTop: RFValue(10),
                          borderColor: colors.INACTIVE,
                          borderWidth: 1.2,
                          borderRadius: 4,
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}
                        labelStyle={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: fonts.MEDIUM_SIZE,
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'capitalize'
                        }}
                      >
                        {tag.name}
                        {!click ? (
                          <Fragment>
                            <Feather
                              onPress={() => handleADeleteInterest(tag.name)}
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
                )}
                <TouchableHighlight
                  onPress={() => setDisplayInterest(true)}
                  underlayColor={colors.TRANSPARENT}
                  style={{
                    position: 'relative',
                    top: RFValue(20)
                  }}
                >
                  <Text
                    style={{
                      display: displayInterest ? 'none' : 'flex',
                      color: colors.PRIMARY,
                      fontSize: fonts.LARGE_SIZE - 2,
                      fontFamily: fonts.WORK_SANS_BOLD,
                      position: 'relative',
                      top: RFValue(20)
                    }}
                  >
                    View more
                  </Text>
                </TouchableHighlight>
                {displayInterest ? (
                  <Fragment>
                    {select?.interest
                      ?.slice(1, select?.interest?.length - 1)
                      ?.map((tag) => (
                        <IdentityText
                          key={tag}
                          onPress={() =>
                            !click ? handleADeleteInterest(tag) : {}
                          }
                          style={{
                            marginRight: RFValue(10),
                            marginTop: RFValue(10),
                            borderColor: colors.INACTIVE,
                            borderWidth: 1.2,
                            borderRadius: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                          }}
                          labelStyle={{
                            fontFamily: fonts.WORK_SANS_BOLD,
                            fontSize: fonts.MEDIUM_SIZE,
                            color: colors.PRIMARY_TEXT,
                            textTransform: 'capitalize'
                          }}
                        >
                          {tag}
                          {!click ? (
                            <Fragment>
                              <Feather
                                onPress={() => handleADeleteInterest(tag)}
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
                    <TouchableHighlight
                      onPress={() => setDisplayInterest(false)}
                      underlayColor={colors.TRANSPARENT}
                      style={{
                        marginTop: RFValue(10),
                        position: 'relative',
                        top: RFValue(10)
                      }}
                    >
                      <Text
                        style={{
                          color: colors.PRIMARY,
                          fontSize: fonts.LARGE_SIZE - 2,
                          fontFamily: fonts.WORK_SANS_BOLD,
                          position: 'relative',
                          top: RFValue(10)
                        }}
                      >
                        View less
                      </Text>
                    </TouchableHighlight>
                  </Fragment>
                ) : null}
              </Fragment>
            ) : (
              <Fragment>
                {select?.interest?.length ? (
                  <Fragment>
                    {select?.interest?.map((tag) => (
                      <IdentityText
                        key={tag}
                        onPress={() =>
                          !click ? handleADeleteInterest(tag) : {}
                        }
                        style={{
                          marginRight: RFValue(10),
                          marginTop: RFValue(10),
                          borderColor: colors.INACTIVE,
                          borderWidth: 1.2,
                          borderRadius: 4,
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}
                        labelStyle={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: fonts.MEDIUM_SIZE,
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'capitalize'
                        }}
                      >
                        {tag}
                        {!click ? (
                          <Fragment>
                            <Feather
                              onPress={() => handleADeleteInterest(tag)}
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
                ) : (
                  <Fragment>
                    {state?.interest?.map((tag) => (
                      <IdentityText
                        key={tag.name}
                        onPress={() =>
                          !click ? handleADeleteInterest(tag.name) : {}
                        }
                        style={{
                          marginRight: RFValue(10),
                          marginTop: RFValue(10),
                          borderColor: colors.INACTIVE,
                          borderWidth: 1.2,
                          borderRadius: 4,
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}
                        labelStyle={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: fonts.MEDIUM_SIZE,
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'capitalize'
                        }}
                      >
                        {tag.name}
                        {!click ? (
                          <Fragment>
                            <Feather
                              onPress={() => handleADeleteInterest(tag.name)}
                              name="x"
                              size={RFValue(13)}
                              color={colors.PRIMARY_TEXT}
                              style={{
                                paddingLeft: RFValue(30),
                                paddingRight: RFValue(50)
                              }}
                            />
                            //{' '}
                          </Fragment>
                        ) : null}
                      </IdentityText>
                    ))}
                  </Fragment>
                )}
              </Fragment>
            )}
            <KeyboardAwareScrollView
              style={{ flexGrow: 1 }}
              scrollEnabled={true}
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{
                flexGrow: 1
              }}
            >
              {state?.click ? (
                <Fragment>
                  <TextInput
                    placeholder={t(`community.createTribe.interestPlaceholder`)}
                    onChangeText={(tagText: string) =>
                      setState({ ...state, tagText: tagText })
                    }
                    value={state.tagText}
                    onBlur={() => handleSelectInterest(state.tagText)}
                    style={{
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT,
                      backgroundColor: colors.WHITE,
                      height: RFValue(30),
                      borderBottomWidth: 2,
                      borderColor: colors.PRIMARY,
                      textTransform: 'capitalize'
                    }}
                  />
                </Fragment>
              ) : (
                <Fragment>
                  {!click ? (
                    <TouchableRipple
                      onPress={() => setState({ ...state, click: true })}
                    >
                      <AddIdentity>+</AddIdentity>
                    </TouchableRipple>
                  ) : null}
                </Fragment>
              )}
            </KeyboardAwareScrollView>
          </Identities>
        </InterestContainer>
      ) : null}

      {participantOf?.length ? (
        <Fragment>
          <Cover style={{ flexDirection: 'row', marginTop: 10 }}>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase'
              }}
            >
              {t(`community.memberPassport.tribe`)}
            </Title>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY,
                marginLeft: RFValue(3)
              }}
            >
              ({participantOf?.length})
            </Title>
          </Cover>
          <FlatList
            horizontal={true}
            data={participantOf
              ?.slice(0, 10)
              ?.concat([{ lastIndex: true } as any])}
            renderItem={_renderMyCommunityItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </Fragment>
      ) : null}

      {myChannels?.length ? (
        <Fragment>
          <Cover style={{ flexDirection: 'row', marginTop: 10 }}>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase'
              }}
            >
              {t(`community.memberPassport.recentChannels`)}
            </Title>
          </Cover>
          <FlatList
            data={myChannels}
            horizontal={true}
            renderItem={_renderMyChannelItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </Fragment>
      ) : null}

      {myConnections?.length ? (
        <Fragment>
          <Cover style={{ flexDirection: 'row', marginTop: 10 }}>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase'
              }}
            >
              {t(`community.memberPassport.connection`)}
            </Title>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY,
                marginLeft: RFValue(3)
              }}
            >
              ({myConnections?.length})
            </Title>
          </Cover>
          <FlatList
            horizontal={true}
            data={myConnections
              ?.slice(0, 10)
              ?.concat([{ lastIndex: true } as any])}
            keyExtractor={({ id }) => id}
            renderItem={_renderMyConnectionItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </Fragment>
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
