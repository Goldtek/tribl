import React, { useEffect, useState, useMemo } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Text } from 'react-native-paper';
import DirectChatCard from './widget';
import { NavigationInterface } from '../../../types';
import Firechat from '../../../../firebase';
import { useThemeContext } from '../../../../theme';
import { ConversationInterface } from '../../types';
import ChatCardSkeleton from '../../../../components/chatCardSkeleton';
import { ROOM_TYPES } from '../../../../firebase/types';
import {
  hideSensitiveView,
  tagScreenName
} from '../../../../utils/uxcamHelper';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DirectDMScreen(props: ScreenProp) {
  const { fonts } = useThemeContext();
  const [chatHistory, setChatHistory] = useState(true);

  const [directMessages, setDirectMessages] = useState<ConversationInterface[]>(
    []
  );

  useEffect(() => {
    tagScreenName('DirectMessageTab');
  }, []);

  useEffect(() => {
    let unsubscribe: any = null;

    (async () => {
      const userConservations = await Firechat.getUserConversations(
        ROOM_TYPES.CONVERSATIONS
      );

      unsubscribe = userConservations?.onSnapshot({
        next: async (snapshot) => {
          if (!snapshot.docs.length) return setChatHistory(false);

          setChatHistory(true);
          const conversationIds = snapshot.docs.map((document) => document.id);

          const userDirectMessages = await Firechat.getConversationMessages(
            conversationIds
          );

          userDirectMessages?.onSnapshot({
            next: (snapshot) => {
              const directMessages = snapshot.docs
                .map((document) => {
                  const message = document.data() as ConversationInterface;
                  return { ...message, id: document.id };
                })
                .sort(
                  //@ts-ignore
                  (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
                );

              setDirectMessages(directMessages);
            }
          });
        }
      });
    })();

    return () => unsubscribe && unsubscribe();
  }, []);

  const _renderItem = ({ item }: { item: ConversationInterface }) => (
    <DirectChatCard key={item.id} {...item} />
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
      bounces={false}
      data={directMessages}
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: RFValue(20),
        paddingBottom: RFValue(20)
      }}
      ref={hideSensitiveView}
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
