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
import CommunityHighLight from '../algoliaCommunityCard';

function CommunityAlgoliaList(props: any) {
  const { colors, fonts } = useThemeContext();

  const { hits, hasMore, refine, closeModal } = props;

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
    () => ({ item }: any) => (
      <CommunityHighLight attribute="id" hit={item} closeModal={closeModal} />
    ),
    []
  );

  const Results = connectStateResults(
    ({ searchState, searchResults, children }: any) => {
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

  return (
    <Results>
      <FlatList
        data={hits}
        keyExtractor={(item: any) => item.objectID}
        ItemSeparatorComponent={_separator}
        showsVerticalScrollIndicator={false}
        onEndReached={() => hasMore && refine()}
        renderItem={_renderItem}
        contentContainerStyle={{
          paddingTop: RFValue(10),
          paddingBottom: RFValue(60)
        }}
      />
    </Results>
  );
}

export default connectInfiniteHits(CommunityAlgoliaList);
