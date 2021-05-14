import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { ActivityIndicator, Divider, Text } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../theme';
import {
  GET_CHANNEL_MEMBERS,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import ActiveMember from './widget';
import Skeleton from './widget/skeleton';
import {
  PassportInterface,
  ChannelMembersRequestInterface
} from '../../../graphql/types';
import { ChatScreenProps } from '../../types';
import { PAGINATION_DEFAULT } from '../../../constants';
import { Mixpanel } from '../../../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStreamContext } from '../../../stream';
import hexToRGB from '../../../utils/hexToRGB';
import { useIsFocused } from '@react-navigation/core';

// DEFINE SCREEN PROP TYPES
interface ChannelMembersProp {
  route: { params: ChatScreenProps };
}

export default function ChannelMembers(props: ChannelMembersProp) {
  const { role, channelId } = props?.route?.params;
  const { colors, fonts } = useThemeContext();
  const { channel } = useStreamContext();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState({ searchTerm: '' });
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);
  const { data: channelData, refetch, fetchMore } = useQuery<
    ChannelMembersRequestInterface
  >(GET_CHANNEL_MEMBERS, {
    variables: { input: { channelId: channel.id } }
  });

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const blockedUsers = userData?.myPassport?.privacy?.blocked;

  useEffect(() => {
    Mixpanel.track('User Views Channel Members', {
      info: `User Views Channel Members`,
      'Activity Screen': 'Channel Screen'
    });

    if (isFocused) refetch();
  }, [isFocused]);

  const channelMembers = channelData?.channelMembers;
  const filteredUsers = channelMembers?.data?.filter((users) => {
    return !blockedUsers?.some((userTwo: any) => users.id == userTwo.id);
  });

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
          channelId: channel.id,
          skip: channelMembers?.data?.length,
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
    <ActiveMember key={item.id} role={role} channelId={channelId} refetch={refetch} {...item} />
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const _renderSeparator = ({ leadingItem }: any) => {
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

  const keysToFilter = ['firstName', 'lastName'];

  const filteredWords =
    filteredUsers &&
    filteredUsers?.filter(createFilter(search.searchTerm, keysToFilter));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <SearchInput
        onChangeText={searchUpdated}
        placeholder="Search"
        placeholderTextColor={colors.PRIMARY_TEXT}
        style={{
          height: RFValue(50),
          color: colors.PRIMARY_TEXT,
          alignItems: 'center',
          elevation: 0,
          borderWidth: 1,
          borderColor: colors.INACTIVE,
          borderRadius: 4,
          paddingHorizontal: 10,
          marginBottom: 10,
          marginHorizontal: 15
        }}
      />
      {filteredUsers ? (
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
              {`There is no member as ${search.searchTerm} in this channel`}
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
              channelMembers?.metadata.totalCount > channelMembers?.data?.length
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
          ItemSeparatorComponent={_renderSeparator}
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
