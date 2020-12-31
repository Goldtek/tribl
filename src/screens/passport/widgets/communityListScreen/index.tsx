import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../../theme';
import Community from './widget';
import { GET_MY_COMMUNITIES } from '../../../../graphql/server/query';
import Skeleton from './widget/myCommunitySkeleton';
import {
  MyCommunitiesRequestInterface,
  CommunityInterface
} from '../../../../graphql/types';
import { tagScreenName } from '../../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityScreenProp extends NavigationInterface {}

export default function CommunityListScreen(props: MyCommunityScreenProp) {
  const { colors, fonts } = useThemeContext();

  useEffect(() => {
    tagScreenName('UserCommunityListScreen');
  }, []);

  const { data, refetch, fetchMore } = useQuery<MyCommunitiesRequestInterface>(
    GET_MY_COMMUNITIES,
    {
      variables: { offset: 0, first: PAGINATION_DEFAULT }
    }
  );

  const [search, setSearch] = useState({ searchTerm: '' });
  const [state, setState] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });

  const myCommunities = data?.myCommunities;

  const filterCommunities = myCommunities?.slice().sort(function (a, b) {
    if (a.name < b.name) return -1;

    if (a.name > b.name) return 1;

    return 0;
  });

  const _renderFooter = useCallback(
    () => (state.callOnScrollEnd ? <ActivityIndicator /> : null),
    [state.callOnScrollEnd]
  );

  const onRefresh = async () => {
    try {
      setState({ ...state, refreshing: true });
      await refetch();
      setState({ ...state, refreshing: false });
    } catch (error) {
      setState({ ...state, refreshing: false });
    }
  };

  const handleEndReach = async () => {
    if (!state.callOnScrollEnd) return;

    fetchMore({
      variables: {
        offset: data?.myCommunities.length,
        first: PAGINATION_DEFAULT
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setState({ ...state, callOnScrollEnd: false });

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          myConnections: [...fetchMoreResult.myCommunities]
        });
      }
    });
  };

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = ['name'];

  const filteredWords =
    filterCommunities &&
    filterCommunities?.filter(createFilter(search.searchTerm, KeysToFilter));

  const _renderItem = ({ item }: { item: CommunityInterface }) => (
    <Community key={item.id} {...item} />
  );

  return (
    <Container>
      <SearchInput
        onChangeText={searchUpdated}
        placeholder="Search"
        placeholderTextColor={colors.PRIMARY_TEXT}
        style={{
          height: RFValue(40),
          color: colors.PRIMARY_TEXT,
          alignItems: 'center',
          elevation: 0,
          borderWidth: 1,
          borderColor: colors.INACTIVE,
          borderRadius: 4,
          paddingHorizontal: 10,
          marginHorizontal: 15
        }}
      />

      {myCommunities ? (
        <FlatList
          data={filteredWords}
          refreshing={state.refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={_renderFooter}
          onEndReachedThreshold={0.5}
          onEndReached={() => setState({ ...state, callOnScrollEnd: true })}
          onMomentumScrollEnd={handleEndReach}
          contentContainerStyle={{
            flexGrow: 1,
            marginTop: RFValue(10),
            paddingBottom: RFValue(60)
          }}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_BOLD,
                margin: RFValue(20),
                textAlign: 'center'
              }}
            >
              You currently don't have any connection
            </Text>
          }
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          keyExtractor={({ id }) => id}
        />
      ) : (
        <Skeleton />
      )}
    </Container>
  );
}
