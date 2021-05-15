import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FlatList, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Searchbar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, TouchableRipple, Title } from 'react-native-paper';
import {
  InstantSearch,
  connectSearchBox,
  Configure,
  connectInfiniteHits
} from 'react-instantsearch-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useKeyboardContext } from 'stream-chat-react-native-core';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import TribeMembersMemberCard from './widget';
import hexToRGB from '../../../utils/hexToRGB';
import ENVIRONMENT_VARIABLES, { searchClient, Mixpanel } from '../../../config';
import { PassportInterface } from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import { CREATE_NEW_CHANNEL } from '../../../graphql/server/mutations';
import AlgoliaList from '../../../components/algoliaList';
import { crashlytics } from '../../../firebase/config';
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';
import { Results } from '../../../components/algoliaCommunityMembersList';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  CloseIcon,
  HeaderTitle,
  HeaderContainer,
  SelectedMemberWrapper,
  SearchInputWrapper
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function NewChannelParticipants(props: ScreenProp) {
  const { navigation, route } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { id, name, channelName, privateStatus } = route?.params;
  const selecteduserRef = useRef<any>(null);
  const { dismissKeyboard } = useKeyboardContext();

  const [tribeMembers, setTribeMembers] = useState<{
    [key: string]: PassportInterface;
  }>({});
  const [state, setState] = useState({ search: {} });

  const { data: userData } = useQuery(GET_USER_PASSPORT);

  // This needs to be implented, users should not see users they blocked when adding users.

  const blockedUsers = userData?.myPassport?.privacy?.blocked;

  const handleSelect = (user: PassportInterface) => {
    dismissKeyboard();
    const { firstName, lastName, id, avatar } = user;

    const payload = {
      id,
      avatar,
      lastName,
      firstName
    } as PassportInterface;

    if (!tribeMembers[id]) {
      return setTribeMembers({ ...tribeMembers, [id]: payload });
    }

    const { [id]: _, ...restUsers } = { ...tribeMembers };

    // Check that the rest users actually exists
    if (restUsers) {
      setTribeMembers(restUsers);
    }
  };

  useEffect(() => {
    tagScreenName('CreateChannelParticipant');
  }, [tribeMembers]);

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const selectedParticipant = [Object.values(tribeMembers || {})];

  const channelParticipant = selectedParticipant[0]?.map((item) => item.id);

  const [createChannel, { loading }] = useMutation(CREATE_NEW_CHANNEL);

  const handleCreateChannel = async () => {
    try {
      Mixpanel.track('Create a new channel', {
        info: `User creates a new channel in ${name} community`,
        'Activity Screen': 'Add participant to new channel screen'
      });

      const { data } = await createChannel({
        variables: {
          payload: {
            communityId: id,
            name: channelName,
            participants: channelParticipant,
            isPrivate: privateStatus,
            moderators: [userData?.myPassport?.id]
          }
        }
      });

      if (data) {
        navigation.navigate('ChannelChatScreen', {
          title: `${channelName}`,
          channelId: data?.addChannelToCommunity?.id,
          newly_created_group: true
        });
      }
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const _renderItem = ({ item }: any) => (
    <TribeMembersMemberCard
      {...item}
      attribute="objectID"
      key={item.id}
      handleSelect={handleSelect}
      selected={Boolean(tribeMembers[item.id])}
    />
  );

  const _renderSelectedItem = ({ item }: { item: PassportInterface }) => (
    <TouchableWithoutFeedback onPress={() => {}}>
      <SelectedMemberWrapper ref={hideSensitiveView}>
        <CloseIcon onPress={() => handleSelect(item)}>
          <Ionicons name="md-close" size={15} color={colors.GREY} />
        </CloseIcon>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: item.avatar || USER_DEFAULT_AVATAR,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: 4
          }}
        />
        <Title
          numberOfLines={1}
          style={{
            color: colors.BLACK,
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(10)
          }}
        >
          {item.firstName} {item.lastName} {item.lastName}
        </Title>
      </SelectedMemberWrapper>
    </TouchableWithoutFeedback>
  );

  const _searchBox = ({ currentRefinement, refine }: any) => (
    <Searchbar
      value={currentRefinement}
      iconColor={colors.PRIMARY_TEXT}
      onChangeText={(value) => refine(value)}
      placeholder={t(`community.chat.search`)}
      style={{
        marginLeft: RFValue(10),
        marginRight: RFValue(10),
        fontFamily: fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE),
        color: colors.SECONDARY_TEXT,
        marginHorizontal: 15,
        elevation: 0,
        borderColor: colors.INACTIVE,
        borderRadius: 4,
        borderWidth: 1
      }}
    />
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), []);

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
          marginHorizontal: RFValue(10),
          backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container>
        <HeaderContainer>
          <TouchableRipple
            onPress={navigation.goBack}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RFValue(40 / 2)
            }}
          >
            <Ionicons
              name="md-arrow-back"
              size={RFValue(24)}
              color={colors.PRIMARY}
            />
          </TouchableRipple>
          <HeaderTitle> {t(`community.chat.addParticipant`)}</HeaderTitle>
          <Button
            loading={loading}
            onPress={handleCreateChannel}
            color={colors.PRIMARY}
            mode="text"
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
            style={{ marginLeft: 'auto', marginRight: RFValue(15) }}
          >
            {t(`community.chat.create`)}
          </Button>
        </HeaderContainer>
        <InstantSearch
          indexName={ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME}
          searchState={state.search}
          searchClient={searchClient}
          onSearchStateChange={onSearchStateChange}
        >
          <Configure hitsPerPage={8} distinct />
          <SearchInputWrapper>
            <AlgoliaSearchBox />
            <FlatList
              ref={selecteduserRef}
              onContentSizeChange={() =>
                selecteduserRef.current.scrollToEnd({
                  animated: true
                })
              }
              onLayout={() =>
                selecteduserRef.current.scrollToEnd({
                  animated: true
                })
              }
              bounces={false}
              horizontal={true}
              scrollEnabled={true}
              onEndReachedThreshold={0.5}
              scrollEventThrottle={16}
              data={Object.values(tribeMembers || {})}
              renderItem={_renderSelectedItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 6
              }}
              style={{
                marginRight: 15,
                paddingRight: 5,
                marginTop: RFValue(10)
              }}
            />
          </SearchInputWrapper>

          <AlgoliaList
            //@ts-ignore
            _separator={_renderSeparator}
            //@ts-ignore
            _renderItem={_renderItem}
          />
        </InstantSearch>
      </Container>
    </SafeAreaView>
  );
}
