import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  connectInfiniteHits,
  InstantSearch,
  connectSearchBox,
  Configure
} from 'react-instantsearch-native';
import {
  Divider,
  TouchableRipple,
  Title,
  Searchbar,
  Text,
  Button
} from 'react-native-paper';
import { useMutation } from '@apollo/react-hooks';
import { Results } from '../../../components/algoliaCommunityMembersList';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import MemberCard from './widgets';
import hexToRGB from '../../../utils/hexToRGB';
import ENVIRONMENT_VARIABLES, { Mixpanel, searchClient } from '../../../config';
import { CREATE_NEW_CHANNEL } from '../../../graphql/server/mutations';
import { PassportInterface } from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName } from '../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  HeaderContainer,
  HeaderTitle,
  IconCover,
  SelectedCover
} from './styles';
import FastImage from 'react-native-fast-image';
import { crashlytics } from '../../../firebase/config';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function NewChannelParticipants(props: ScreenProp) {
  const { navigation, route } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { id, name, channelName } = route?.params;
  const [state, setState] = useState({ search: {} });

  const [participant, setparticipant] = useState({
    selectedParticipant: new Map()
  });

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const handleSelect = (selected: {}) => {
    console.tron('id', selected.id);
    const id = selected.id;
    if (!participant.selectedParticipant.has(id)) {
      return setparticipant({
        ...participant,
        selectedParticipant: new Map(
          participant.selectedParticipant.set(id, selected)
        )
      });
    }

    participant.selectedParticipant.delete(id);
    setparticipant({
      ...participant,
      selectedParticipant: new Map(participant.selectedParticipant)
    });
  };

  const selectedParticipant = [
    ...Array.from(participant.selectedParticipant.values())
  ];

  const [createChannel, { loading }] = useMutation(CREATE_NEW_CHANNEL, {
    variables: {
      payload: {
        communityId: id,
        name: channelName,
        participants: [],
        isPrivate: false
      }
    }
  });

  console.tron('selectedParticipant', selectedParticipant);
  const channelParticipant = selectedParticipant?.map((item) => item.id);

  console.tron('channelParticipant', channelParticipant);

  useEffect(() => {
    tagScreenName('CreateChannelParticipant');
  }, []);

  const SelectedParticipants = () => {
    return (
      <SelectedCover>
        {selectedParticipant?.length ? (
          <Fragment>
            {selectedParticipant?.map((item) => (
              <TouchableOpacity
                key={item}
                style={{
                  flexDirection: 'row',
                  width: RFValue(45),
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  marginVertical: 5,
                  marginHorizontal: 5,
                  borderRadius: 4
                }}
                onPress={() => handleSelect(item)}
              >
                <Fragment>
                  <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                      uri: item.avatar,
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: RFValue(35),
                      height: RFValue(35),
                      borderRadius: RFValue(2)
                    }}
                  />
                  <IconCover>
                    <Feather
                      name="x"
                      style={{
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        color: colors.WHITE
                      }}
                    />
                  </IconCover>
                </Fragment>
              </TouchableOpacity>
            ))}
          </Fragment>
        ) : null}
      </SelectedCover>
    );
  };

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <MemberCard
      key={item.id}
      {...item}
      selected={participant.selectedParticipant.get(item.id)}
      handleSelect={handleSelect}
      member={item.firstName}
    />
  );

  const _memberList = (props: any) => {
    const { hits, hasMore, refineNext } = props;
    return (
      <Results>
        <FlatList
          data={hits}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 1.5,
                backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
              }}
            />
          )}
          onEndReached={() => hasMore && refineNext()}
          renderItem={_renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: RFValue(60)
          }}
        />
      </Results>
    );
  };

  const _searchBox = ({ currentRefinement, refine }: any) => (
    <Searchbar
      value={currentRefinement}
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
      iconColor={colors.PRIMARY_TEXT}
    />
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), []);
  const AlgoliaMemberList = useMemo(() => connectInfiniteHits(_memberList), []);

  const handleCreateChannel = async () => {
    try {
      Mixpanel.track('Create a new channel', {
        info: `User creates a new channel in ${name} community`,
        'Activity Screen': 'Add participant to new channel screen'
      });
      await createChannel();
      navigation.navigate('ChannelChatScreen', {
        params: { title: `#${channelName}` }
      });
    } catch (error) {
      console.tron('error', error);
      crashlytics.recordError(error);
    }
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
          searchClient={searchClient}
          indexName={ENVIRONMENT_VARIABLES.ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME}
          searchState={state.search}
          onSearchStateChange={onSearchStateChange}
        >
          <Configure
            filters={`"communityId": ${id}`}
            hitsPerPage={8}
            distinct
          />
          <AlgoliaSearchBox />
          <SelectedParticipants />
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              marginTop: RFValue(20),
              marginLeft: RFValue(10),
              textTransform: 'capitalize'
            }}
          >
            {`${name} ${t(`community.tabPanel.members`)}`}
          </Title>
          <AlgoliaMemberList />
        </InstantSearch>
      </Container>
    </SafeAreaView>
  );
}
