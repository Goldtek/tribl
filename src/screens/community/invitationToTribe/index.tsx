import React, { useState, useRef, Fragment, useMemo } from 'react';
import { Title, Text, Button, Searchbar } from 'react-native-paper';
import {
  InstantSearch,
  connectSearchBox,
  Configure
} from 'react-instantsearch-native';
import {
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Switch,
  TextInput
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { PassportInterface } from '../../../graphql/types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import GradientButton from '../../../components/gradientButton';
import {
  INVITE_TO_TRIBE,
  INVITE_USER_TO_APP
} from '../../../graphql/server/mutations';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { logEvent } from '../../../utils/uxcamHelper';
import ENVIRONMENT_VARIABLES, { Mixpanel } from '../../../config';
import { crashlytics } from '../../../firebase/config';
import { Toast } from '../../../components/rootToaster';
import { useKeyboardContext } from 'stream-chat-react-native-core';
import { searchClient } from '../../../config';
import AlgoliaList from '../../../components/algoliaList';
import InviteAlgoliaHighlight from '../../../components/inviteAlgoliaHighlight';

import {
  Container,
  ButtonCover,
  Tags,
  TagButtonCover,
  InviteCover
} from './styles';

// DEFINE SCREEN PROP TYPES
interface InviteFriendsScreenProp extends NavigationInterface { }

export default function InviteFriendsToTribe(props: InviteFriendsScreenProp) {
  const { navigation, route } = props;
  const communityId = route?.params?.communityId;
  const communityName = route?.params?.communityName;
  const { t } = useTranslation();
  const selecteduserRef = useRef<any>(null);
  const { dismissKeyboard } = useKeyboardContext();
  const { colors, fonts } = useThemeContext();
  let numColumns = 2;

  const [search, setSearch] = useState({ search: {} });

  const [selected, setSelected] = useState<{
    [key: string]: PassportInterface;
  }>({});

  const [state, setState] = useState({
    click: false,
    emails: new Map(),
    emailText: ''
  });

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
  };

  const handleEmailSelect = (selected: string) => {
    if (!state.emails.has(selected)) {
      return setState({
        ...state,
        emails: new Map(state.emails.set(selected, selected)),
        click: false,
        emailText: ''
      });
    }

    state.emails.delete(selected);
    setState({
      ...state,
      emails: new Map(state.emails)
    });
  };

  const selectedEmail = [...Array.from(state.emails.values())];

  const indexName = ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME;

  const participants = Object.values(selected || {});

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;

  const [inviteToTribe, { loading }] = useMutation(INVITE_TO_TRIBE, {
    variables: {
      payload: {
        communityId: communityId,
        receipientIds: participants.map(({ id }) => id)
      }
    }
  });

  const [inviteToApp, { loading: inviteToAppLoading }] = useMutation(
    INVITE_USER_TO_APP,
    {
      variables: {
        payload: {
          community: communityName,
          email: selectedEmail,
          passport: userDetails?.id
        }
      }
    }
  );

  const handleInputError = (error: string) => {
    Toast.show(t(`community.createTribe.${error}`));
  };

  const sendTribeInvite = async () => {
    if (!participants?.length) {
      return handleInputError('inviteError');
    }

    logEvent('send tribe invite', { from: 'passport' });

    try {
      Mixpanel.track('Send Tribe Invite', {
        info: `Invite friends to ${communityName}`,
        'Activity Screen': 'Tribe invitation screen'
      });
      await inviteToTribe();
      setSelected({});
      navigation.goBack();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const sendAppInvite = async () => {
    if (!selectedEmail?.length) {
      return handleInputError('inviteError');
    }

    logEvent('send app invite', { from: 'community' });

    try {
      Mixpanel.track('Send App Invite', {
        info: `Invite friends to ${communityName}`,
        'Activity Screen': 'Tribe invitation screen'
      });
      await inviteToApp();
      setState({
        ...state,
        emails: new Map()
      });
      navigation.goBack();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const handleSelect = (user: PassportInterface) => {
    dismissKeyboard();
    const { firstName, lastName, id, avatar } = user;

    const payload = {
      id,
      avatar,
      lastName,
      firstName
    } as PassportInterface;

    if (!selected[id]) {
      return setSelected({ ...selected, [id]: payload });
    }

    const { [id]: _, ...restUsers } = { ...selected };
    setSelected(restUsers);
  };

  const _renderItem = ({ item }: any) => {
    if (selected[item.id]) return null;
    return (
      <InviteAlgoliaHighlight
        {...item}
        key={item.id}
        handleSelect={() => handleSelect(item)}
      />
    );
  };

  const _renderCard = ({ item }: any) => {
    return (
      <TouchableOpacity
        key={item?.id}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: RFValue(150),
          paddingVertical: 5,
          paddingHorizontal: 8,
          marginVertical: 5,
          marginHorizontal: 5,
          backgroundColor: colors.INACTIVE,
          borderRadius: 4
        }}
        onPress={() => handleSelect(item)}
      >
        <Fragment>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: item?.avatar,
              priority: FastImage.priority.high
            }}
            style={{
              marginRight: 5,
              width: RFValue(25),
              height: RFValue(25),
              borderRadius: RFValue(50)
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_MEDIUM,
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              width: '60%'
            }}
          >
            {`${item?.firstName} ${item?.lastName}`}
          </Text>
          <Feather
            name="x"
            style={{
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              color: colors.PRIMARY_TEXT,
              marginLeft: RFValue(10)
            }}
          />
        </Fragment>
      </TouchableOpacity>
    );
  };

  if (participants.length % 2 == 0) {
    numColumns = Math.floor(participants.length / 2);
  } else {
    numColumns = Math.floor(participants.length / 2) + 1;
  }

  const _renderTags = () => {
    return (
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          borderWidth: 1,
          borderColor: colors.INPUT,
          marginHorizontal: 15
        }}
      >
        <FlatList
          numColumns={numColumns}
          data={participants}
          renderItem={_renderCard}
          ref={selecteduserRef}
          onContentSizeChange={() =>
            selecteduserRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            selecteduserRef.current.scrollToEnd({ animated: true })
          }
          keyExtractor={({ id }) => id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flex: 1, paddingBottom: 30 }}
        />
      </ScrollView>
    );
  };

  const onSearchStateChange = (query: string) => {
    setSearch({ ...search, search: query });
  };

  const _searchBox = ({ currentRefinement, refine }: any) => (
    <Searchbar
      value={currentRefinement}
      onChangeText={(value) => refine(value)}
      placeholder={t(`community.invitation.placeholder`)}
      style={{
        height: RFValue(40),
        width: '100%',
        fontFamily: fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE),
        color: colors.SECONDARY_TEXT,
        backgroundColor: colors.WHITE,
        elevation: 0,
        borderColor: colors.INACTIVE,
        borderRadius: 4,
        borderWidth: 1
      }}
      iconColor={colors.PRIMARY_TEXT}
    />
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), [
    indexName
  ]);

  return (
    <Container>
      <Image
        source={require('../../../../assets/images/icon.png')}
        style={{
          resizeMode: 'contain',
          width: RFValue(80),
          height: RFValue(80),
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          textAlign: 'center',
          paddingHorizontal: 15
        }}
      >
        {t(`community.invitation.title`)}
      </Title>
      <Text
        style={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.PRIMARY_TEXT,
          textAlign: 'center',
          paddingHorizontal: 15
        }}
      >
        {t(`community.invitation.text`)}
      </Text>
      <InviteCover>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.LARGE_SIZE - 2),
            color: colors.PRIMARY_TEXT
          }}
        >
          {isEnabled
            ? t(`community.invitation.emailLabel`)
            : t(`community.invitation.label`)}
        </Title>
        <Switch
          trackColor={{ false: colors.DISABLED, true: colors.ONLINE }}
          thumbColor={colors.WHITE}
          ios_backgroundColor={colors.DISABLED}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
        />
      </InviteCover>
      {isEnabled ? (
        <Fragment>
          {selectedEmail?.length ? (
            <Tags>
              {selectedEmail?.map((email) => (
                <TagButtonCover>
                  <Button
                    key={email}
                    onPress={() => handleEmailSelect(email)}
                    style={{
                      marginRight: RFValue(10),
                      marginTop: RFValue(10),
                      borderColor: colors.SECONDARY_TEXT,
                      borderWidth: 1,
                      borderRadius: 4,
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                    labelStyle={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: fonts.MEDIUM_SIZE,
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'lowercase'
                    }}
                  >
                    {email} {'   '}
                    <Feather
                      name="x"
                      size={RFValue(13)}
                      color={colors.PRIMARY_TEXT}
                      style={{
                        paddingLeft: RFValue(30),
                        paddingRight: RFValue(50)
                      }}
                    />
                  </Button>
                </TagButtonCover>
              ))}
            </Tags>
          ) : null}
          <TextInput
            placeholder={t(`community.invitation.emailLabel`)}
            onChangeText={(emailText: string) =>
              setState({ ...state, emailText: emailText })
            }
            value={state.emailText}
            onBlur={() => handleEmailSelect(state.emailText)}
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              color: colors.PRIMARY_TEXT,
              backgroundColor: colors.WHITE,
              height: RFValue(40),
              borderWidth: 1,
              borderColor: colors.INACTIVE,
              borderRadius: 4,
              textTransform: 'capitalize',
              marginHorizontal: RFValue(15),
              paddingHorizontal: RFValue(15)
            }}
          />
        </Fragment>
      ) : (
        <Fragment>
          {participants?.length ? <_renderTags /> : null}

          <View
            style={{
              borderWidth: 1,
              borderColor: colors.INPUT,
              maxHeight: '40%',
              marginHorizontal: 15
            }}
          >
            <InstantSearch
              indexName={indexName}
              searchState={search.search}
              searchClient={searchClient}
              onSearchStateChange={onSearchStateChange}
            >
              <Configure hitsPerPage={5} distinct />
              <AlgoliaSearchBox />
              <AlgoliaList
                //@ts-ignore
                contentContainerStyle={{
                  paddingTop: 0,
                  paddingBottom: RFValue(10)
                }}
                //@ts-ignore
                _separator={() => null}
                //@ts-ignore
                _renderItem={_renderItem}
              />
            </InstantSearch>
          </View>
        </Fragment>
      )}

      <ButtonCover>
        <GradientButton
          onPress={isEnabled ? sendAppInvite : sendTribeInvite}
          loading={isEnabled ? inviteToAppLoading : loading}
          style={{ height: 50 }}
          gradientContainerstyle={{ height: 50, marginTop: RFValue(15) }}
          contentStyle={{ height: 50 }}
        >
          {t(`community.invitation.invite`)}
        </GradientButton>
        <Button
          labelStyle={{
            color: colors.PRIMARY_TEXT,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE),
            textTransform: 'capitalize'
          }}
          onPress={() => navigation.goBack()}
        >
          {t(`community.invitation.cancel`)}
        </Button>
      </ButtonCover>
    </Container>
  );
}
