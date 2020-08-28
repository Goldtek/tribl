import React, { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { NavigationInterface } from '../../../../types';
import MemberCard from '../chatMemberCard';
import ChatCardSkeleton from '../../../../../components/chatCardSkeleton';

import { Container } from './styles';
import { Text } from 'react-native-paper';
import { useThemeContext } from '../../../../../theme';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelScreen(props: ScreenProp) {
  const { fonts } = useThemeContext();

  const [state, setState] = useState(false);

  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
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
          You currently don't have any request connection
        </Text>
      ),
    []
  );

  return (
    <FlatList
      data={[]}
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
  );
}
