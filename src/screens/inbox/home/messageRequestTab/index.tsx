import React, { useMemo, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Text } from 'react-native-paper';
import { NavigationInterface } from '../../../types';
import Firechat from '../../../../firebase';
import MessageRequestCard from './widget';
import ChatCardSkeleton from '../../../../components/chatCardSkeleton';
import { ConversationInterface } from '../../types';
import { ROOM_TYPES } from '../../../../firebase/types';
import { useThemeContext } from '../../../../theme';
import {
  hideSensitiveView,
  tagScreenName
} from '../../../../utils/uxcamHelper';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function MessageRequestTab(props: ScreenProp) {
  const { fonts } = useThemeContext();
  const [requestHistory, setRequestHistory] = useState(true);

  const [messageRequests, setMessageRequests] = useState<
    ConversationInterface[]
  >([]);

  useEffect(() => {
    tagScreenName('MessageRequestTab');
  }, []);

  useEffect(() => {
    let unsubscribe: any = null;

    (async () => {
      const userConservations = await Firechat.getUserConversations(
        ROOM_TYPES.MESSAGE_REQUEST
      );

      unsubscribe = userConservations?.onSnapshot({
        next: async (snapshot) => {
          if (!snapshot.docs.length) return setRequestHistory(false);

          setRequestHistory(true);
          const conversationIds = snapshot.docs.map((document) => document.id);

          const userMessageRequest = await Firechat.getConversationMessages(
            conversationIds
          );

          userMessageRequest?.onSnapshot({
            next: (snapshot) => {
              const messages = snapshot.docs.map((document) => {
                const message = document.data() as ConversationInterface;
                return { ...message, id: document.id };
              });

              setMessageRequests(messages);
            }
          });
        }
      });
    })();

    return () => unsubscribe && unsubscribe();
  }, []);

  const _renderItem = ({ item }: { item: ConversationInterface }) => (
    <MessageRequestCard key={item.id} {...item} {...props} />
  );

  const renderEmptyList = useMemo(
    () => () => (
      <Container>
        <ChatCardSkeleton skeletonSize={3} />
      </Container>
    ),
    []
  );

  return requestHistory ? (
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
  );
}
