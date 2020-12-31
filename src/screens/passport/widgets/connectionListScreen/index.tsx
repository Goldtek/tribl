import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../../theme';
import Connection from './widget';
import { GET_MY_CONNECTIONS } from '../../../../graphql/server/query';
import Skeleton from './widget/myConnectionSkeleton';
import {
  MyConnectionsInterface,
  PassportInterface,
  ShowConnectionNotificationBadge
} from '../../../../graphql/types';
import { tagScreenName } from '../../../../utils/uxcamHelper';
import { GET_CONNECTION_NOTIFICATION_BADGE } from '../../../../graphql/cache/query';
import { PAGINATION_DEFAULT } from '../../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();

  useEffect(() => {
    tagScreenName('UserConnectionListScreen');
  }, []);

  const { data, refetch, fetchMore } = useQuery<MyConnectionsInterface>(
    GET_MY_CONNECTIONS,
    { variables: { offset: 0, first: PAGINATION_DEFAULT } }
  );

  const { data: notificationData } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const [search, setSearch] = useState({ searchTerm: '' });
  const [state, setState] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });

  const myConnection = data?.myConnections;

  const filterConnections = myConnection?.slice().sort(function (a, b) {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

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
        offset: data?.myConnections.length,
        first: PAGINATION_DEFAULT
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setState({ ...state, callOnScrollEnd: false });

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          myConnections: [...fetchMoreResult.myConnections]
        });
      }
    });
  };

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = ['firstName', 'lastName'];

  const filteredWords =
    filterConnections &&
    filterConnections?.filter(createFilter(search.searchTerm, KeysToFilter));

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <Connection key={item.id} {...item} />
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

      {myConnection ? (
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
