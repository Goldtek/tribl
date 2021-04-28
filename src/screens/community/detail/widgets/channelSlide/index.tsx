import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import ChannelCard from './widget';
import { useThemeContext } from '../../../../../theme';
import { NavigationInterface } from '../../../../types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import {
  CommunityChannelRequestInterface,
  CommunityInterface
} from '../../../../../graphql/types';
import { GET_COMMUNITY_CHANNELS } from '../../../../../graphql/server/query';
import { useLazyQuery } from '@apollo/react-hooks';
import { useIsFocused } from '@react-navigation/native';
import { PAGINATION_DEFAULT } from '../../../../../constants';

import { LoadingIndicatorContainer, LoadingChannels } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { communityDetails: CommunityInterface };
}

export default function ChannelScreen(props: ScreenProp) {
  const { communityDetails } = props.route;
  const { colors } = useThemeContext();

  const isFocused = useIsFocused();

  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  useEffect(() => {
    tagScreenName('TribeChannelScreen');
  }, []);

  const [getCommunityChannels, { data, refetch, fetchMore }] = useLazyQuery<
    CommunityChannelRequestInterface
  >(GET_COMMUNITY_CHANNELS, {
    variables: {
      input: {
        filter: { community: { id: communityDetails.id } },
        limit: PAGINATION_DEFAULT,
        skip: 0
      }
    }
  });

  const communityChannels = data?.Channel;
  const filteredChannels = communityChannels?.data.filter(
    (channel) => channel.isPrivate == false || channel.isMember == true
  );

  useEffect(() => {
    communityChannels ? refetch() : getCommunityChannels();
  }, [isFocused, communityChannels]);

  const handleEndReach = async () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: {
          skip: communityChannels?.data?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          communityChannels: {
            ...prev.Channel,
            data: [...prev.Channel.data, ...fetchMoreResult.Channel.data]
          }
        });
      }
    });
  };

  const _renderItem = (props: any) => (
    <ChannelCard {...props} communityDetails={communityDetails} />
  );

  return (
    <FlatList
      bounces={true}
      renderItem={_renderItem}
      data={filteredChannels}
      contentContainerStyle={{ flexGrow: 1 }}
      ItemSeparatorComponent={() => (
        <Divider style={{ borderWidth: 0.6, borderColor: colors.DISABLED }} />
      )}
      ListEmptyComponent={
        <LoadingIndicatorContainer>
          <ActivityIndicator size={30} />
          <LoadingChannels>loading channels...</LoadingChannels>
        </LoadingIndicatorContainer>
      }
      keyExtractor={(item) => item.id}
      onEndReachedThreshold={0.5}
      onMomentumScrollEnd={handleEndReach}
      onEndReached={() => {
        if (
          communityChannels &&
          communityChannels?.metadata.totalCount > communityChannels.data.length
        ) {
          setCallOnScrollEnd(true);
        }
      }}
    />
  );
}
