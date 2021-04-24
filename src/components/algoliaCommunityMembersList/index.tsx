import React, { useMemo, Fragment } from 'react';
import {
  connectInfiniteHits,
  connectStateResults
} from 'react-instantsearch-native';
import { Divider, Text } from 'react-native-paper';
import { FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../utils/hexToRGB';
import { useThemeContext } from '../../theme';
import HighLight from '../algoliaInboxCard';
import { GET_USER_PASSPORT } from '../../graphql/server/query';
import removeDuplicateMembers from '../../utils/removeDuplicatePassports';

function AlgoliaList(props: any) {
  const { colors } = useThemeContext();

  const { hits, hasMore, refine } = props;

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const blockedUsers = userData?.myPassport?.privacy?.blocked;

  const _separator = useMemo(
    () => () => (
      <Divider
        style={{
          height: 1.5,
          backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
        }}
      />
    ),
    []
  );

  const _renderItem = useMemo(
    () => ({ item }: any) => <HighLight attribute="id" hit={item} />,
    []
  );

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
        keyExtractor={(item: any) => item.objectID}
        ItemSeparatorComponent={_separator}
        onEndReached={() => hasMore && refine()}
        renderItem={_renderItem}
        style={{
          width: '100%',
          paddingHorizontal: RFValue(20),
          marginTop: RFValue(30)
        }}
        contentContainerStyle={{ paddingBottom: RFValue(60) }}
      />
    </Results>
  );
}

export const Results = connectStateResults(
  ({ searchState, searchResults, children }: any) => {
    const { fonts } = useThemeContext();

    return searchResults && searchResults.nbHits !== 0 ? (
      children
    ) : searchState && !searchState.query ? (
      <Fragment>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item
              width={60}
              height={60}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={80}
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item
              width={60}
              height={60}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={80}
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item
              width={60}
              height={60}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={80}
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item
              width={60}
              height={60}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={80}
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Fragment>
    ) : (
      <Text
        style={{
          fontSize: RFValue(fonts.LARGE_SIZE),
          fontFamily: fonts.WORK_SANS_BOLD,
          margin: RFValue(20),
          textAlign: 'center'
        }}
      >
        No results have been found for {searchState.query}.
      </Text>
    );
  }
);

export default connectInfiniteHits(AlgoliaList);
