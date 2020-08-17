import React, { useMemo } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-native';
import { Divider } from 'react-native-paper';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../utils/hexToRGB';
import { useThemeContext } from '../../theme';
import CommunityHighLight from '../algoliaCommunityCard';

function CommunityAlgoliaList(props: any) {
  const { colors } = useThemeContext();

  const { hits, hasMore, refine, navigation, closeModal } = props;

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
      <CommunityHighLight
        attribute="id"
        hit={item}
        //@ts-ignore
        navigation={navigation}
        closeModal={closeModal}
      />
    ),
    []
  );

  return (
    <FlatList
      data={hits}
      keyExtractor={(item: any) => item.objectID}
      ItemSeparatorComponent={_separator}
      onEndReached={() => hasMore && refine()}
      renderItem={_renderItem}
      style={{
        width: '100%',
        paddingHorizontal: RFValue(20)
      }}
    />
  );
}

export default connectInfiniteHits(CommunityAlgoliaList);
