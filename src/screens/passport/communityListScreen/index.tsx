import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery } from '@apollo/react-hooks';
import { FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationInterface } from '../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../theme';
import Community from './widget';
import { GET_MY_COMMUNITIES } from '../../../graphql/server/query';
import Skeleton from './widget/myCommunitySkeleton';
import {
  MyCommunitiesRequestInterface,
  CommunityInterface
} from '../../../graphql/types';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityScreenProp extends NavigationInterface {
  route: { params: { details: CommunityInterface[]; userTribe: boolean } };
}

export default function CommunityListScreen(props: MyCommunityScreenProp) {
  const params = props.route?.params;

  const { colors, fonts } = useThemeContext();

  const [fetchMyCommunities, { data, fetchMore, refetch }] = useLazyQuery<
    MyCommunitiesRequestInterface
  >(GET_MY_COMMUNITIES);

  useEffect(() => {
    tagScreenName('UserCommunityListScreen');
  }, []);

  useEffect(() => {
    if (params.userTribe) {
      fetchMyCommunities();
    }
  }, [params.userTribe]);

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState({ searchTerm: '' });
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const myCommunities = params.userTribe
    ? data?.myCommunities?.data
    : params.details;

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const handleEndReach = async () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: {
          skip: data?.myCommunities?.data?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          myCommunities: {
            ...prev.myCommunities,
            data: [
              ...prev.myCommunities.data,
              ...fetchMoreResult.myCommunities.data
            ]
          }
        });
      }
    });
  };

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const keysToFilter = ['name'];

  const filteredWords =
    myCommunities &&
    myCommunities?.filter(createFilter(search.searchTerm, keysToFilter));

  const _renderItem = ({ item }: { item: CommunityInterface }) => (
    <Community key={item.id} {...item} />
  );

  return (
    <Container>
      <StatusBar style="dark" />
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
          marginHorizontal: 10,
          marginVertical: 10
        }}
      />

      {myCommunities ? (
        <FlatList
          data={filteredWords}
          refreshing={refreshing}
          renderItem={_renderItem}
          onRefresh={handleRefresh}
          onEndReachedThreshold={0.5}
          keyExtractor={({ id }) => id}
          ListFooterComponent={_renderFooter}
          onMomentumScrollEnd={handleEndReach}
          showsVerticalScrollIndicator={false}
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
              {params.userTribe
                ? `You currently don't have any tribes`
                : `No tribes found`}
            </Text>
          }
          onEndReached={() => {
            if (
              data?.myCommunities?.data &&
              data?.myCommunities?.metadata.totalCount > myCommunities.length
            ) {
              setCallOnScrollEnd(true);
            }
          }}
        />
      ) : (
        <Skeleton />
      )}
    </Container>
  );
}
