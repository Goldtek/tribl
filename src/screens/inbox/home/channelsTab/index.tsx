import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator, Text } from 'react-native-paper';
import ChannelChatCard from './widget';
import { NavigationInterface } from '../../../types';
import Firechat from '../../../../firebase';
import { useThemeContext } from '../../../../theme';
import { ChannelConversationInterface } from '../../types';
import ChatCardSkeleton from '../../../../components/chatCardSkeleton';
import { useQuery } from '@apollo/react-hooks';
import {
  hideSensitiveView,
  tagScreenName
} from '../../../../utils/uxcamHelper';
import { USER_CHANNELS } from '../../../../graphql/server/query';
import { MyChannelRequestInterface } from '../../../../graphql/types';
import batchConversation from '../../../../utils/batchConversation';
import { PAGINATION_DEFAULT } from '../../../../constants';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelsTab(props: ScreenProp) {
  const { fonts } = useThemeContext();

  const [chats, setChats] = useState<{
    history: boolean;
    messages: ChannelConversationInterface[];
  }>({ history: true, messages: [] });

  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const { data, fetchMore } = useQuery<MyChannelRequestInterface>(
    USER_CHANNELS,
    {
      pollInterval: 1000,
      variables: { offset: 0, first: PAGINATION_DEFAULT * 2 }
    }
  );

  useEffect(() => {
    tagScreenName('ChannelsTab');
  }, []);

  const handleEndReach = async () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        offset: data?.myChannels.length,
        first: PAGINATION_DEFAULT * 2
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          myChannels: [...prev.myChannels, ...fetchMoreResult.myChannels]
        });
      }
    });
  };

  useEffect(() => {
    let unsubscribe: any = null;

    const getChannelsMessages = async () => {
      if (!data?.myChannels.length) return;

      const batchedChannelIds = batchConversation(data?.myChannels);

      const userChannels = await Promise.all(
        batchedChannelIds.map((channelIds) =>
          Firechat.getUserChannels(channelIds)
        )
      );

      let snapshotChannels: ChannelConversationInterface[] = [];

      userChannels.forEach((channel) => {
        channel?.onSnapshot({
          next: (snapshot) => {
            if (!snapshot.docs.length) {
              return setChats({ ...chats, history: false });
            }

            for (let index = 0; index < snapshot.docs.length; index++) {
              const document = snapshot.docs[index];
              const message = document.data() as ChannelConversationInterface;
              snapshotChannels = snapshotChannels.filter(
                (x) => x.id !== document.id
              );
              snapshotChannels.push({ ...message, id: document.id });
            }

            const channelMessages = snapshotChannels.sort(
              (a, b) =>
                new Date(b.lastMessage.createdAt).getTime() -
                new Date(a.lastMessage.createdAt).getTime()
            );

            setChats({ ...chats, history: true, messages: channelMessages });
          }
        });
      });
    };

    if (data?.myChannels) {
      if (!data?.myChannels.length) {
        return setChats({ ...chats, history: false });
      }

      getChannelsMessages();
    }

    return () => unsubscribe && unsubscribe();
  }, [data?.myChannels]);

  const _renderItem = ({ item }: { item: ChannelConversationInterface }) => (
    <ChannelChatCard key={item.id} {...item} />
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const renderEmptyList = useMemo(
    () => () => (
      <Container>
        <ChatCardSkeleton skeletonSize={3} />
      </Container>
    ),
    []
  );

  if (!chats.history) {
    return (
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

  return (
    <FlatList
      bounces={false}
      data={chats.messages}
      renderItem={_renderItem}
      ref={hideSensitiveView}
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: RFValue(20),
        paddingBottom: RFValue(20)
      }}
      ListEmptyComponent={renderEmptyList}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      // onMomentumScrollEnd={handleEndReach}
      // ListFooterComponent={_renderFooter}
      // onEndReached={() => setCallOnScrollEnd(true)}
      keyExtractor={(item) => item.id}
    />
  );
}
