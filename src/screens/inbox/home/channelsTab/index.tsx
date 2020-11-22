import React, { useEffect, useState, useMemo } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Text } from 'react-native-paper';
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

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelsTab(props: ScreenProp) {
  const { fonts } = useThemeContext();
  const [channelHistory, setChannelHistory] = useState(true);

  const [channelMessages, setChannelMessages] = useState<
    ChannelConversationInterface[]
  >([]);

  const { data } = useQuery<MyChannelRequestInterface>(USER_CHANNELS, {
    pollInterval: 1000
  });

  useEffect(() => {
    tagScreenName('ChannelsTab');
  }, []);

  useEffect(() => {
    let unsubscribe: any = null;

    if (!data?.myChannels.length) return setChannelHistory(false);

    const batchedChannelIds = batchConversation(data?.myChannels);

    const getChannelsMessages = async () => {
      setChannelHistory(true);
      const userChannels = await Promise.all(
        batchedChannelIds.map((channelIds) =>
          Firechat.getUserChannels(channelIds)
        )
      );

      let snapshotChannels: ChannelConversationInterface[] = [];

      userChannels.forEach((channel, index) => {
        channel?.onSnapshot({
          next: (snapshot) => {
            for (let index = 0; index < snapshot.docs.length; index++) {
              const document = snapshot.docs[index];
              const message = document.data() as ChannelConversationInterface;
              snapshotChannels = snapshotChannels.filter(
                (x) => x.id !== document.id
              );
              snapshotChannels.push({ ...message, id: document.id });
            }

            if (index === userChannels.length - 1) {
              const channelMessages = snapshotChannels.sort(
                (a, b) =>
                  new Date(b.lastMessage.createdAt).getTime() -
                  new Date(a.lastMessage.createdAt).getTime()
              );
              setChannelMessages(channelMessages);
            }
          }
        });
      });
    };

    getChannelsMessages();

    return () => unsubscribe && unsubscribe();
  }, [data?.myChannels]);

  const _renderItem = ({ item }: { item: ChannelConversationInterface }) => (
    <ChannelChatCard key={item.id} {...item} />
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
