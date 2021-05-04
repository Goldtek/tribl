import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { Divider, Title, Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import {
  connectInfiniteHits,
  InstantSearch,
  connectSearchBox,
  Configure
} from 'react-instantsearch-native';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../../theme';
import MemberCard from './widget/member';
import { NavigationInterface } from '../../../../../types';
import { Results } from '../../../../../../components/algoliaCommunityMembersList';
import {
  CommunityInterface,
  PassportInterface
} from '../../../../../../graphql/types';
import ENVIRONMENT_VARIABLES, {
  searchClient,
  Mixpanel
} from '../../../../../../config';
import { tagScreenName } from '../../../../../../utils/uxcamHelper';
import hexToRGB from '../../../../../../utils/hexToRGB';
import removeDuplicateMembers from '../../../../../../utils/removeDuplicatePassports';
import { GET_USER_PASSPORT } from '../../../../../../graphql/server/query';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberSlideProp extends NavigationInterface {
  route: { communityDetails: CommunityInterface };
}

export default function MemberSlide(props: MemberSlideProp) {
  const { communityDetails } = props.route;
  //@ts-ignore
  const id = props?.route?.communityDetails?.data?.createCommunity?.id;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({ search: {} });

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const blockedUsers = userData?.myPassport?.privacy?.blocked;

  useEffect(() => {
    tagScreenName('TribeMembersScreen');
    Mixpanel.track('User Views Community Members', {
      info: `User Views ${communityDetails?.name} Community Members`,
      'Activity Screen': 'Community Member Screen'
    });
  }, []);

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <MemberCard key={item.id} {...item} />
  );

  const _memberList = (props: any) => {
    const { hits, hasMore, refineNext } = props;
    const filterHits = removeDuplicateMembers(hits?.slice());
    const filteredUsers = filterHits?.filter(function (users) {
      return !blockedUsers?.some(function (userTwo: any) {
        return users.id == userTwo.id;
      });
    });

    return (
      <Results>
        <FlatList
          data={filteredUsers}
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
          contentContainerStyle={{ paddingTop: 20, paddingBottom: RFValue(60) }}
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

  return (
    <Container>
      <InstantSearch
        searchClient={searchClient}
        indexName={ENVIRONMENT_VARIABLES.ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME}
        searchState={state.search}
        onSearchStateChange={onSearchStateChange}
      >
        <Configure filters={`"communityId": ${id}`} hitsPerPage={8} distinct />
        <AlgoliaSearchBox />
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
          {t(`community.tabPanel.memberTitle`)}
        </Title>
        <AlgoliaMemberList />
      </InstantSearch>
    </Container>
  );
}
