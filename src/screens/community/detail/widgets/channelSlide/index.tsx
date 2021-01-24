import React, { useEffect } from 'react';
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

import { LoadingIndicatorContainer, LoadingChannels } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { communityDetails: CommunityInterface };
}

export default function ChannelScreen(props: ScreenProp) {
  const { communityDetails } = props.route;
  const { colors } = useThemeContext();

  const isFocused = useIsFocused();

  useEffect(() => {
    tagScreenName('TribeChannelScreen');
  }, []);

  const [getCommunityChannels, { data, refetch }] = useLazyQuery<
    CommunityChannelRequestInterface
  >(GET_COMMUNITY_CHANNELS, {
    variables: { communityId: communityDetails.id }
  });

  useEffect(() => {
    data ? refetch() : getCommunityChannels();
  }, [isFocused, data]);

  const _renderItem = (props: any) => (
    <ChannelCard {...props} communityDetails={communityDetails} />
  );

  return (
    <FlatList
      bounces={false}
      renderItem={_renderItem}
      data={data?.communityChannels}
      contentContainerStyle={{ flex: 1 }}
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
    />
  );
}
