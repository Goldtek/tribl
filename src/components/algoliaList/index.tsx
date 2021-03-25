import React, { useMemo, Fragment } from 'react';
import {
  connectInfiniteHits,
  connectStateResults
} from 'react-instantsearch-native';
import { Divider, Text } from 'react-native-paper';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import hexToRGB from '../../utils/hexToRGB';
import { useThemeContext } from '../../theme';
import Highlight from '../algoliaHighlight';
import { PassportInterface } from '../../graphql/types';

export type AlgoliaListProps = {
  hits: PassportInterface[];
  hasMore: boolean;
  refineNext: () => void;
};

function AlgoliaList(props: AlgoliaListProps) {
  const { colors, fonts } = useThemeContext();
  const { hits, hasMore, refineNext } = props;

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
    () => ({ item }: { item: PassportInterface }) => (
      <Highlight attribute="id" hit={item} key={item.id} />
    ),
    []
  );

  const Results = connectStateResults(
    ({ searchState, searchResults, children }: any) => {
      return searchResults && searchResults.nbHits !== 0 ? (
        children
      ) : searchState && !searchState.query ? (
        <Fragment>
          {[...Array(5)].map((_, index) => (
            <SkeletonPlaceholder key={`skeleton${index.toString()}`}>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                margin={10}
              >
                <SkeletonPlaceholder.Item
                  width={60}
                  height={60}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item marginLeft={20}>
                  <SkeletonPlaceholder.Item
                    width={150}
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
          ))}
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

  return (
    <FlatList
      data={hits}
      renderItem={_renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={_separator}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      scrollEventThrottle={16}
      ListEmptyComponent={<Results />}
      onEndReached={() => hasMore && refineNext()}
      contentContainerStyle={{
        paddingTop: RFValue(10),
        paddingBottom: RFValue(60)
      }}
    />
  );
}

export const Results = connectStateResults(
  ({ searchState, searchResults, children }: any) => {
    const { fonts } = useThemeContext();

    return searchResults && searchResults.nbHits !== 0 ? (
      children
    ) : searchState && !searchState.query ? (
      <Fragment>
        {[...Array(5)].map((_, index) => (
          <SkeletonPlaceholder key={`skeleton${index.toString()}`}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              margin={10}
            >
              <SkeletonPlaceholder.Item
                width={60}
                height={60}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item marginLeft={20}>
                <SkeletonPlaceholder.Item
                  width={150}
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
        ))}
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
