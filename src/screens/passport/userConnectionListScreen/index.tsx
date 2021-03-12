import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationInterface } from '../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../theme';
import MemberCard from '../../../components/connectionCard';
import Skeleton from './widget/myCommunitySkeleton';
import { PassportInterface } from '../../../graphql/types';
import { tagScreenName } from '../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityScreenProp extends NavigationInterface {
  route: { params: { details: PassportInterface[] } };
}

export default function UserConnectionListScreen(props: MyCommunityScreenProp) {
  const myConnections = props.route?.params.details;

  const { colors } = useThemeContext();

  useEffect(() => {
    tagScreenName('UserConnectionListScreen');
  }, []);

  const [search, setSearch] = useState({ searchTerm: '' });
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const keysToFilter = ['firstName', 'lastName'];

  const filteredWords =
    myConnections &&
    myConnections?.filter(createFilter(search.searchTerm, keysToFilter));

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <MemberCard key={item.id} {...item} />
  );

  return (
    <Container>
      <StatusBar style="dark" />
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
          marginHorizontal: 10,
          marginVertical: 10
        }}
      />

      {myConnections ? (
        <FlatList
          data={filteredWords}
          renderItem={_renderItem}
          onEndReachedThreshold={0.5}
          keyExtractor={({ id }) => id}
          ListFooterComponent={_renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            marginTop: RFValue(10),
            paddingBottom: RFValue(60)
          }}
        />
      ) : (
        <Skeleton />
      )}
    </Container>
  );
}
