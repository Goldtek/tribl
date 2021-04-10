import React, { useState, Fragment, useMemo } from 'react';
import { Title, Text, Button, Searchbar, Divider } from 'react-native-paper';
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
  FlatList
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { PassportInterface } from '../../../graphql/types';
import { useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import GradientButton from '../../../components/gradientButton';
import { INVITE_TO_TRIBE } from '../../../graphql/server/mutations';
import { logEvent } from '../../../utils/uxcamHelper';
import ENVIRONMENT_VARIABLES, { Mixpanel } from '../../../config';
import { crashlytics } from '../../../firebase/config';
import { Toast } from '../../../components/rootToaster';
import { useKeyboardContext } from 'stream-chat-react-native-core';
import { searchClient } from '../../../config';
import hexToRGB from '../../../utils/hexToRGB';
import AlgoliaList from '../../../components/algoliaList';
import InviteAlgoliaHighlight from '../../../components/inviteAlgoliaHighlight';

import { Container, TagCover, ButtonCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface InviteFriendsScreenProp extends NavigationInterface {}

export default function InviteFriendsToTribe(props: InviteFriendsScreenProp) {
  const { navigation } = props;
  const communityId = props.route.params?.communityId;

  const { t } = useTranslation();
  const { dismissKeyboard } = useKeyboardContext();
  const { colors, fonts } = useThemeContext();

  const [search, setSearch] = useState({ search: {} });

  const [selected, setSelected] = useState<{
    [key: string]: PassportInterface;
  }>({});

  const indexName = ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME;

  const participants = Object.values(selected);

  const [inviteToTribe, { loading }] = useMutation(INVITE_TO_TRIBE, {
    variables: {
      payload: {
        communityId: communityId,
        receipientIds: participants.map(({ id }) => id)
      }
    }
  });

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
        info: `Invite friends to ${communityId.name}`,
        'Activity Screen': 'Tribe invitation screen'
      });
      await inviteToTribe();
      setSelected({});
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

  const _renderSeparator = ({ leadingItem }: any) => {
    const user = leadingItem as PassportInterface;

    if (
      (!user.verified ||
        user.lastName == null ||
        user.firstName == null ||
        user.currentLocation?.city == null,
      user.currentLocation?.state == null)
    ) {
      return null;
    }

    return (
      <Divider
        style={{
          height: 1.5,
          backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
        }}
      />
    );
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
          marginTop: 5,
          marginBottom: 5,
          backgroundColor: colors.INACTIVE,
          paddingVertical: RFValue(4),
          paddingHorizontal: RFValue(10),
          marginHorizontal: RFValue(10),
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
              width: RFValue(25),
              height: RFValue(25),
              borderRadius: RFValue(50),
              marginRight: RFValue(7)
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_MEDIUM,
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              color: colors.PRIMARY_TEXT,
              width: RFValue(80),
              textTransform: 'capitalize'
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

  const _renderTags = () => {
    return (
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ borderWidth: 1, borderColor: colors.INPUT }}
      >
        <FlatList
          numColumns={participants?.length ? participants?.length / 2 : 2}
          data={participants}
          renderItem={_renderCard}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1,
            alignSelf: participants?.length ? 'flex-start' : 'center'
          }}
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
          marginRight: 'auto',
          marginTop: RFValue(20)
        }}
      />
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          textAlign: 'center',
          marginTop: 20
        }}
      >
        {t(`community.invitation.title`)}
      </Title>
      <Text
        style={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.PRIMARY_TEXT,
          textAlign: 'center'
        }}
      >
        {t(`community.invitation.text`)}
      </Text>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.LARGE_SIZE - 2),
          color: colors.PRIMARY_TEXT,
          marginTop: RFValue(40)
        }}
      >
        {t(`community.invitation.label`)}
      </Title>
      <KeyboardAwareScrollView
        scrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
      >
        <Fragment>
          <InstantSearch
            indexName={indexName}
            searchState={search.search}
            searchClient={searchClient}
            onSearchStateChange={onSearchStateChange}
          >
            {participants?.length ? <_renderTags /> : null}
            <Configure hitsPerPage={5} distinct />
            <AlgoliaSearchBox />
            <View style={{ borderWidth: 1, borderColor: colors.INPUT }}>
              <AlgoliaList
                //@ts-ignore
                contentContainerStyle={{
                  paddingTop: 0,
                  paddingBottom: RFValue(10)
                }}
                //@ts-ignore
                _separator={_renderSeparator}
                //@ts-ignore
                _renderItem={_renderItem}
              />
            </View>
          </InstantSearch>
        </Fragment>
      </KeyboardAwareScrollView>
      <ButtonCover>
        <GradientButton
          onPress={sendTribeInvite}
          loading={loading}
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
