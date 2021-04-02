import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../theme';
import { GET_CHANNEL_MEMBERS } from '../../../graphql/server/query';
import ActiveMember from './widget';
import Skeleton from './widget/skeleton';
import {
  PassportInterface,
  ChannelMembersRequestInterface
} from '../../../graphql/types';
import { ChatScreenProps } from '../../types';
import { PAGINATION_DEFAULT } from '../../../constants';
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';
import { Mixpanel } from '../../../config';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  route: { params: ChatScreenProps };
}

function ChannelMembers(props: ModalProp) {
  const { colors, fonts } = useThemeContext();

  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState({ searchTerm: '' });

  const { channelId } = props.route?.params;

  const { data: channelData, refetch, fetchMore } = useQuery<
    ChannelMembersRequestInterface
  >(GET_CHANNEL_MEMBERS, {
    variables: { input: { channelId } }
  });

  useEffect(() => {
    Mixpanel.track('User Views Channel Members', {
      info: `User Views Channel Members`,
      'Activity Screen': 'Channel Screen'
    });
  }, []);

  const channelMembers = channelData?.channelMembers;

  const filterMembers = removeDuplicateMembers(channelMembers?.data?.slice());

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEndReach = async () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: {
          channelId,
          skip: filterMembers?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          channelMembers: {
            ...prev.channelMembers,
            data: [
              ...prev.channelMembers.data,
              ...fetchMoreResult.channelMembers.data
            ]
          }
        });
      }
    });
  };

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <ActiveMember key={item.id} {...item} />
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const keysToFilter = ['firstName', 'lastName'];

  const filteredWords =
    filterMembers &&
    filterMembers?.filter(createFilter(search.searchTerm, keysToFilter));

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
      {filterMembers ? (
        <FlatList
          data={filteredWords}
          ListEmptyComponent={
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textAlign: 'center'
              }}
            >
              There are no members in this channel
            </Text>
          }
          keyExtractor={({ id }) => id}
          onMomentumScrollEnd={handleEndReach}
          scrollEventThrottle={16}
          onEndReachedThreshold={1}
          removeClippedSubviews={true}
          onEndReached={() => {
            if (
              channelMembers &&
              channelMembers?.metadata.totalCount > filterMembers.length
            ) {
              setCallOnScrollEnd(true);
            }
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: RFValue(20),
            paddingTop: RFValue(20)
          }}
          renderItem={_renderItem}
          ListFooterComponent={_renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.BLACK}
              colors={[colors.BLACK]}
            />
          }
        />
      ) : (
        <Skeleton />
      )}
    </SafeAreaView>
  );
}

export default React.memo(ChannelMembers);
