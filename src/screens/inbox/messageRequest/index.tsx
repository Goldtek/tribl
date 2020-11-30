import React, { useMemo, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { NavigationInterface } from '../../types';
import Firechat from '../../../firebase';
import MessageRequestCard from './widget';
import ChatCardSkeleton from '../../../components/chatCardSkeleton';
import { ConversationInterface } from '../types';
import { ROOM_TYPES } from '../../../firebase/types';
import { useThemeContext } from '../../../theme';
import { hideSensitiveView, tagScreenName } from '../../../utils/uxcamHelper';
import batchConversation from '../../../utils/batchConversation';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function MessageRequestTab(props: ScreenProp) {
  const { fonts, colors } = useThemeContext();
  const [requestHistory, setRequestHistory] = useState(true);

  const [messageRequests, setMessageRequests] = useState<
    ConversationInterface[]
  >([]);

  useEffect(() => {
    tagScreenName('MessageRequestTab');
  }, []);

  useEffect(() => {
    let unsubscribe: any = null;

    const getMessageRequests = async () => {
      const userConservations = await Firechat.getUserConversations(
        ROOM_TYPES.MESSAGE_REQUEST
      );

      unsubscribe = userConservations?.onSnapshot({
        next: async (snapshot) => {
          if (!snapshot.docs.length) return setRequestHistory(false);

          setRequestHistory(true);
          const batchedConversationIds = batchConversation(snapshot.docs);

          const userMessageRequests = await Promise.all(
            batchedConversationIds.map((conversationIds) =>
              Firechat.getConversationMessages(conversationIds)
            )
          );

          let snapshotMessages: ConversationInterface[] = [];

          userMessageRequests.forEach((userMessageRequest, index) => {
            userMessageRequest?.onSnapshot({
              next: (snapshot) => {
                for (let index = 0; index < snapshot.docs.length; index++) {
                  const document = snapshot.docs[index];
                  const message = document.data() as ConversationInterface;
                  snapshotMessages = snapshotMessages.filter(
                    (x) => x.id !== document.id
                  );
                  snapshotMessages.push({ ...message, id: document.id });
                }

                if (index === userMessageRequests.length - 1) {
                  const messageRequests = snapshotMessages.sort(
                    (a, b) =>
                      new Date(b.lastMessage.createdAt).getTime() -
                      new Date(a.lastMessage.createdAt).getTime()
                  );
                  setMessageRequests(messageRequests);
                }
              }
            });
          });
        }
      });
    };

    getMessageRequests();
    return () => unsubscribe && unsubscribe();
  }, []);

  const _renderItem = ({ item }: { item: ConversationInterface }) => (
    <MessageRequestCard key={item.id} {...item} {...props} />
  );

  const renderEmptyList = useMemo(
    () => () => (
      <Container style={{ paddingHorizontal: 10 }}>
        <ChatCardSkeleton skeletonSize={3} />
      </Container>
    ),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container>
        {requestHistory ? (
          <FlatList
            bounces={false}
            data={messageRequests}
            ref={hideSensitiveView}
            contentContainerStyle={{
              flexGrow: 1,
              marginTop: RFValue(20),
              paddingBottom: RFValue(20)
            }}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            renderItem={_renderItem}
            keyExtractor={(item: any) => item.id}
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
            You currently don't have any request connection
          </Text>
        )}
      </Container>
    </SafeAreaView>
  );
}
