import React, { Fragment, useCallback } from 'react';
import {
  connectInfiniteHits,
  connectStateResults
} from 'react-instantsearch-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { FlatList, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { PassportInterface } from '../../graphql/types';
import { useThemeContext } from '../../theme';
import Highlight from '../inviteAlgoliaHighlight';

export type AlgoliaListProps = {
  hasMore: boolean;
  refineNext: () => void;
  hits: PassportInterface[];
  _separator?: () => JSX.Element;
  handleAddition: any;
};

function AlgoliaList(props: AlgoliaListProps) {
  const { fonts, colors } = useThemeContext();

  const { hits, hasMore, refineNext, handleAddition } = props;

  const _defaultRenderItem = ({ item }: { item: PassportInterface }) => {
    return (
      <Highlight
        attribute="id"
        hit={item}
        key={item.id}
        handleAddition={handleAddition}
      />
    );
  };

  const Results = connectStateResults(({ searchState }: any) => (
    <Text
      style={{
        fontSize: RFValue(fonts.LARGE_SIZE),
        fontFamily: fonts.WORK_SANS_MEDIUM,
        margin: RFValue(20),
        textAlign: 'center'
      }}
    >
      No results have been found for {searchState.query}.
    </Text>
  ));

  const _renderFooter = useCallback(
    () => (hasMore ? <ActivityIndicator /> : null),
    [hasMore]
  );

  return hits.length ? (
    <View style={{ borderWidth: 1, borderColor: colors.INPUT }}>
      <FlatList
        data={hits}
        renderItem={_defaultRenderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        ListEmptyComponent={<Results />}
        ListFooterComponent={_renderFooter}
        keyboardShouldPersistTaps="always"
        onEndReached={() => hasMore && refineNext()}
        contentContainerStyle={{
          paddingTop: RFValue(10),
          paddingBottom: RFValue(60)
        }}
      />
    </View>
  ) : (
    <Fragment>
      {[...Array(5)].map((_, index) => (
        <SkeletonPlaceholder key={`skeleton${index.toString()}`}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item width={30} height={30} borderRadius={4} />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={150}
                height={10}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={80}
                height={10}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}

export default connectInfiniteHits(AlgoliaList);
