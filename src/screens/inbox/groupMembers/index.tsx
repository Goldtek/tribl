import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../theme';
import GroupMember from './widget';
import { ChatScreenProps } from '../../types';
import { Mixpanel } from '../../../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStreamContext } from '../../../stream';
import hexToRGB from '../../../utils/hexToRGB';

// DEFINE SCREEN PROP TYPES
interface GroupMembersProp {
  route: { params: ChatScreenProps };
}

export default function GroupMembers(props: GroupMembersProp) {
  const { colors, fonts } = useThemeContext();

  const { channel } = useStreamContext();
  const [search, setSearch] = useState({ searchTerm: '' });

  useEffect(() => {
    Mixpanel.track('User Views Group Members', {
      info: `User Views Group Members`,
      'Activity Screen': 'Group Members Screen'
    });
  }, []);

  const groupAdmin = channel.data?.created_by;

  const groupMembers = Object.values(channel.state.members.asMutable()).sort(
    (a, _) => {
      if (a.user?.id === groupAdmin?.id) {
        return -1;
      } else {
        return 1;
      }
    }
  );

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const _renderItem = ({ item }: any) => (
    <GroupMember key={item.user?.id} {...item} />
  );

  const _renderSeparator = () => (
    <Divider
      style={{
        height: 1.5,
        backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
      }}
    />
  );

  const keysToFilter = ['name, firstName', 'lastName'];

  const filteredWords =
    groupMembers &&
    groupMembers?.filter(createFilter(search.searchTerm, keysToFilter));

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
            {`There is no member as ${search.searchTerm} in this group`}
          </Text>
        }
        scrollEventThrottle={16}
        onEndReachedThreshold={1}
        removeClippedSubviews={true}
        keyExtractor={({ user }) => `${user?.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: RFValue(20),
          paddingTop: RFValue(20)
        }}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderSeparator}
      />
    </SafeAreaView>
  );
}
