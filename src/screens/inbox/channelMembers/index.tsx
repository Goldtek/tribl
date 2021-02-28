import React, { useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
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

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  route: { params: ChatScreenProps };
}

function ChannelMembers(props: ModalProp) {
  const { colors, fonts } = useThemeContext();

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const [state, setState] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });
  const userDetails = userData?.myPassport;
  const channelId = props.route?.params?.channelId;
  const userId = userDetails?.id;

  const {
    loading: channelLoading,
    data: channelData,
    refetch,
    fetchMore
  } = useQuery<ChannelMembersRequestInterface>(GET_CHANNEL_MEMBERS, {
    variables: { input: { channelId: channelId } }
  });

  const channelMembers = channelData?.channelMembers?.data;

  const memberList = channelMembers?.slice().sort((a, b) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  });

  const onRefresh = async () => {
    setState({ ...state, refreshing: true });
    await refetch();
    setState({ ...state, refreshing: false });
  };

  const handleEndReach = async () => {
    if (!state.callOnScrollEnd) return;

    fetchMore({
      variables: {
        offset: channelMembers?.length,
        first: PAGINATION_DEFAULT
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setState({ ...state, callOnScrollEnd: false });

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          channelMembers: [fetchMoreResult.channelMembers]
        });
      }
    });
  };

  const filterMembers = memberList?.filter((member) => member.id !== userId);

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <ActiveMember key={item.id} {...item} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {filterMembers ? (
        <FlatList
          data={filterMembers}
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
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          onEndReached={() => setState({ ...state, callOnScrollEnd: true })}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: RFValue(20),
            paddingTop: RFValue(20)
          }}
          renderItem={_renderItem}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={onRefresh}
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
