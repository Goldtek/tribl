import React, { useEffect, useState, useMemo } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MemberCard from '../chatMemberCard';
import { NavigationInterface } from '../../../../types';
import Firechat from '../../../../../firebase';
import { useThemeContext } from '../../../../../theme';
import { GroupInterface } from '../../../types';
import { fireAuth } from '../../../../../firebase/config';
import ChatCardSkeleton from '../../../../../components/chatCardSkeleton';

import { Container } from './styles';
import { Text } from 'react-native-paper';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DirectDMScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const userId = fireAuth.currentUser?.uid as string;

  const [state, setState] = useState(true);

  const [directMessages, setDirectMessages] = useState<GroupInterface[]>([]);

  useEffect(() => {
    (async () => {
      const directMessages = await Firechat.getUserDirectMessages();
      if (!directMessages) setState(false);

      const unsubscribe = directMessages?.onSnapshot({
        next: (snapshot) => {
          const groupConversations = snapshot.docs.map((documentSnapshot) => {
            const message = documentSnapshot.data() as GroupInterface;

            const [directMessageIcons] = message.members.filter(
              ({ receiverId }) => receiverId !== userId
            );

            return {
              ...message,
              name: directMessageIcons.title,
              avatar: directMessageIcons.avatar
            };
          });

          setDirectMessages(groupConversations);
        }
      });

      return () => unsubscribe && unsubscribe();
    })();
  }, []);

  const _renderItem = ({ item }: { item: GroupInterface }) => (
    <MemberCard key={item.id} {...item} />
  );

  const renderEmptyList = useMemo(
    () => () =>
      state ? (
        <Container>
          <ChatCardSkeleton skeletonSize={3} />
        </Container>
      ) : (
        <Text
          style={{
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            margin: RFValue(20),
            textAlign: 'center'
          }}
        >
          You currently don't have any messages
        </Text>
      ),
    []
  );

  return (
    <FlatList
      data={directMessages}
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: RFValue(20),
        paddingBottom: RFValue(20)
      }}
      ListEmptyComponent={renderEmptyList}
      showsVerticalScrollIndicator={false}
      renderItem={_renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}
