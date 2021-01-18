import React, { useMemo, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import ChannelCard from './widget';
import { useThemeContext } from '../../../../../theme';
import { NavigationInterface } from '../../../../types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import { CommunityInterface } from '../../../../../graphql/types';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { communityDetails: CommunityInterface };
}

export default function ChannelScreen(props: ScreenProp) {
  const { communityDetails } = props.route;
  const { colors } = useThemeContext();

  useEffect(() => {
    tagScreenName('TribeChannelScreen');
  }, []);

  const _renderItem = useMemo(
    () => (props: any) => (
      <ChannelCard {...props} communityDetails={communityDetails} />
    ),
    []
  );

  return (
    <FlatList
      renderItem={_renderItem}
      data={communityDetails?.channels}
      ItemSeparatorComponent={() => (
        <Divider style={{ borderWidth: 0.6, borderColor: colors.DISABLED }} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
