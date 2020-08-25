import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { RFValue } from 'react-native-responsive-fontsize';
import MemberCard from '../chatMemberCard';
import MembersData from '../../../../../libs/memberChat/index.json';
import Firechat from '../../../../../firebase';
import { GroupInterface } from '../../../types';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DirectDMScreen(props: ScreenProp) {
  const [directMessages, setDirectMessages] = useState<GroupInterface[]>([]);

  useEffect(() => {
    (async () => {
      const directMessages = await Firechat.getUserDirectMessages();
      if (directMessages) setDirectMessages(directMessages);
    })();
  }, []);

  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
  );

  return (
    <FlatList
      data={directMessages}
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
