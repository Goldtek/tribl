import React, { useEffect, useState, useMemo } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Text } from 'react-native-paper';
import MemberCard from '../chatMemberCard';
import { NavigationInterface } from '../../../../types';
import Firechat from '../../../../../firebase';
import { useThemeContext } from '../../../../../theme';
import { GroupInterface } from '../../../types';
import { fireAuth } from '../../../../../firebase/config';
import ChatCardSkeleton from '../../../../../components/chatCardSkeleton';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DirectDMScreen(props: ScreenProp) {
  const { fonts } = useThemeContext();
  const userId = fireAuth.currentUser?.uid as string;

  const [chatHistory, setChatHistory] = useState(true);

  const [directMessages, setDirectMessages] = useState<GroupInterface[]>([]);

  useEffect(() => {
    (async () => {
      const directMessages = await Firechat.getUserDirectMessages();
      if (!directMessages) setChatHistory(false);

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
    () => () => (
      <Container>
        <ChatCardSkeleton skeletonSize={3} />
      </Container>
    ),
    []
  );

  return chatHistory ? (
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
  );
}
