import React from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import MemberCard from '../chatMemberCard';
import MembersData from '../../../../../libs/memberChat/index.json';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelScreen(props: ScreenProp) {
  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
  );

  return (
    <FlatList
      data={MembersData}
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: RFValue(20),
        paddingBottom: RFValue(20)
      }}
      showsVerticalScrollIndicator={false}
      renderItem={_renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}
