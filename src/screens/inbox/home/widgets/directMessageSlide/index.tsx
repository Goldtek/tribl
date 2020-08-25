import React, { useEffect, useState, useMemo } from 'react';
import { FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import MemberCard from '../chatMemberCard';
import { NavigationInterface } from '../../../../types';
import Firechat from '../../../../../firebase';
import { useThemeContext } from '../../../../../theme';
import { GroupInterface } from '../../../types';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DirectDMScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const [directMessages, setDirectMessages] = useState<GroupInterface[]>([]);

  useEffect(() => {
    (async () => {
      const directMessages = await Firechat.getUserDirectMessages();
      if (directMessages) setDirectMessages(directMessages);
    })();
  }, []);

  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
  );

  const renderEmptyList = useMemo(
    () => () => (
      <Container>
        <Text
          style={{
            color: colors.PRIMARY_TEXT,
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE)
          }}
        >
          No chats yet
        </Text>
      </Container>
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
