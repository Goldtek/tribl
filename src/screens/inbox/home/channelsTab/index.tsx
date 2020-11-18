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

export default function ChannelsTab(props: ScreenProp) {
  const { fonts } = useThemeContext();
  const [channelHistory, setChannelHistory] = useState(true);

  const [channelMessages, setChannelMessages] = useState<
    ConversationInterface[]
  >([]);

  useEffect(() => {
    tagScreenName('ChannelsTab');
  }, []);

  useEffect(() => {
    let unsubscribe: any = null;

    (async () => {
      const userChannels = await Firechat.getUserChannels(
        ROOM_TYPES.PARTICIPANTS
      );

      unsubscribe = userChannels?.onSnapshot({
        next: async (snapshot) => {
          if (!snapshot.docs.length) return setChannelHistory(false);

          setChannelHistory(true);
          const channelMessages = snapshot.docs
            .map((document) => {
              const message = document.data() as ConversationInterface;
              return { ...message, id: document.id };
            })
            .sort(
              //@ts-ignore
              (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
            );

          setChannelMessages(channelMessages);
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

  return channelHistory ? (
    <FlatList
      bounces={false}
      data={channelMessages}
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
      You currently haven't joined any channel
    </Text>
  );
}
