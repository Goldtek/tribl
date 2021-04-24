import React, { Fragment, useCallback } from 'react';
import {
  connectInfiniteHits,
  connectStateResults
} from 'react-instantsearch-native';
import { StyleProp, ViewStyle, FlatList } from 'react-native';
import { ActivityIndicator, Divider, Text } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';
import { PassportInterface } from '../../graphql/types';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import Highlight from '../algoliaHighlight';
import removeDuplicateMembers from '../../utils/removeDuplicatePassports';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER_PASSPORT } from '../../graphql/server/query';

export type AlgoliaListProps = {
  hasMore: boolean;
  refineNext: () => void;
  hits: PassportInterface[];
  _separator?: () => JSX.Element;
  _renderItem?: (props: any) => JSX.Element;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const _defaultSeparator = ({ leadingItem }: any) => {
  const { colors } = useThemeContext();
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

const _defaultRenderItem = ({ item }: { item: PassportInterface }) => (
  <Highlight attribute="id" hit={item} key={item.id} />
);

function AlgoliaList(props: AlgoliaListProps) {
  const { fonts } = useThemeContext();

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const blockedUsers = userData?.myPassport?.privacy?.blocked;
  const {
    hits,
    hasMore,
    refineNext,
    _renderItem = _defaultRenderItem,
    _separator = _defaultSeparator,
    contentContainerStyle
  } = props;

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

  const filterHits = removeDuplicateMembers(hits?.slice());
  const filteredUsers = filterHits?.filter(function (users) {
    return !blockedUsers?.some(function (userTwo: any) {
      return users.id == userTwo.id;
    });
  });

  return filteredUsers?.length ? (
    <FlatList
      data={filteredUsers}
      renderItem={_renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={_separator}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      scrollEventThrottle={16}
      ListEmptyComponent={<Results />}
      ListFooterComponent={_renderFooter}
      keyboardShouldPersistTaps="always"
      onEndReached={() => hasMore && refineNext()}
      contentContainerStyle={[
        {
          paddingTop: RFValue(10),
          paddingBottom: RFValue(60)
        },
        contentContainerStyle
      ]}
    />
  ) : (
    <Fragment>
      {[...Array(5)].map((_, index) => (
        <SkeletonPlaceholder key={`skeleton${index.toString()}`}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item width={60} height={60} borderRadius={4} />
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
  );
}

export default connectInfiniteHits(AlgoliaList);
