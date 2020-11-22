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
import batchConversation from '../../../../utils/batchConversation';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DirectMessageTab(props: ScreenProp) {
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

    const getDirectMessages = async () => {
      const userConservations = await Firechat.getUserConversations(
        ROOM_TYPES.CONVERSATIONS
      );

      unsubscribe = userConservations?.onSnapshot({
        next: async (snapshot) => {
          if (!snapshot.docs.length) return setChatHistory(false);

          setChatHistory(true);
          const batchedConversationIds = batchConversation(snapshot.docs);

          const userDirectMessages = await Promise.all(
            batchedConversationIds.map((conversationIds) =>
              Firechat.getConversationMessages(conversationIds)
            )
          );

          let snapshotMessages: ConversationInterface[] = [];

          userDirectMessages.forEach((userDirectMessage, index) => {
            userDirectMessage?.onSnapshot({
              next: (snapshot) => {
                for (let index = 0; index < snapshot.docs.length; index++) {
                  const document = snapshot.docs[index];
                  const message = document.data() as ConversationInterface;
                  snapshotMessages = snapshotMessages.filter(
                    (x) => x.id !== document.id
                  );
                  snapshotMessages.push({ ...message, id: document.id });
                }

                if (index === userDirectMessages.length - 1) {
                  const directMessages = snapshotMessages.sort(
                    (a, b) =>
                      new Date(b.lastMessage.createdAt).getTime() -
                      new Date(a.lastMessage.createdAt).getTime()
                  );
                  setDirectMessages(directMessages);
                }
              }
            });
          });
        }
      });
    };

    getDirectMessages();

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
        fontSize: RFValue(fonts.MEDIUM_SIZE),
        fontFamily: fonts.WORK_SANS_BOLD,
        margin: RFValue(20),
        textAlign: 'center'
      }}
    >
      You currently don't have any messages
    </Text>
  );
}
