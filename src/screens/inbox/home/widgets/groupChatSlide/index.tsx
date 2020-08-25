import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { RFValue } from 'react-native-responsive-fontsize';
import MemberCard from '../chatMemberCard';
import Firechat from '../../../../../firebase';
import { GroupInterface } from '../../../types';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function GroupChatSlide(props: ScreenProp) {
  const [groups, setGroups] = useState<GroupInterface[]>([]);

  useEffect(() => {
    (async () => {
      const groups = await Firechat.getUserGroupMessages();
      if (groups) setGroups(groups);
    })();
  }, []);

  const _renderItem = ({ item }: { item: GroupInterface }) => (
    <MemberCard {...item} {...props} />
  );

  return (
    <FlatList
      data={groups}
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

export default React.memo(GroupChatSlide);
