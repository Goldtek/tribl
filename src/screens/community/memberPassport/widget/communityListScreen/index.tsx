import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../../../theme';
import Community from './widget';
import Skeleton from './widget/myCommunitySkeleton';
import { CommunityInterface } from '../../../../../graphql/types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityScreenProp extends NavigationInterface {}

export default function CommunityListScreen(props: MyCommunityScreenProp) {
  const { colors, fonts } = useThemeContext();
  const details = props.route?.params?.details;

  useEffect(() => {
    tagScreenName('UserCommunityListScreen');
  }, []);

  const [search, setSearch] = useState({ searchTerm: '' });
  const [state, setState] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });

  const filterCommunities = details?.slice().sort(function (a: any, b: any) {
    if (a.name < b.name) return -1;

    if (a.name > b.name) return 1;

    return 0;
  });

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = ['name'];

  const filteredWords =
    filterCommunities &&
    filterCommunities?.filter(createFilter(search.searchTerm, KeysToFilter));

  const _renderItem = ({ item }: { item: CommunityInterface }) => (
    <Community key={item.id} {...item} />
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

      {details ? (
        <FlatList
          data={filteredWords}
          refreshing={state.refreshing}
          onEndReachedThreshold={0.5}
          onEndReached={() => setState({ ...state, callOnScrollEnd: true })}
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
              This user does not have any connection
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
