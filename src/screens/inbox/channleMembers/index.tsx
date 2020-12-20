import React, { Fragment } from 'react';
import { Text } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import {
  GET_CHANNEL_MEMBERS,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import ActiveMember from './widget';
import Skeleton from './widget/skeleton';
import {
  PassportInterface,
  ChannelMembersRequestInterface
} from '../../../graphql/types';
import { FlatList } from 'react-native';
import { ChatScreenProps } from '../../types';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  route: { params: ChatScreenProps };
}

function ChannelMembers(props: ModalProp) {
  const { colors, fonts } = useThemeContext();

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userId = userDetails?.id;

  const channelId = props.route?.params?.channelId;
  const { loading: channelLoading, data: channelData } = useQuery<
    ChannelMembersRequestInterface
  >(GET_CHANNEL_MEMBERS, {
    variables: { channelId }
  });

  const channelMembers = channelData?.channelMembers;
  const memberList = channelMembers?.slice().sort((a, b) => {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

    return 0;
  });

  const filterMembers = memberList?.filter((member) => member.id !== userId);

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <ActiveMember key={item.id} {...item} />
  );

  return (
    <Fragment>
      <FlatList
        data={filterMembers || []}
        onEndReachedThreshold={0.01}
        ListEmptyComponent={
          channelLoading ? (
            <Skeleton />
          ) : (
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                textAlign: 'center'
              }}
            >
              There are no members in this channel
            </Text>
          )
        }
        keyExtractor={({ id }: PassportInterface) => id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: RFValue(20),
          paddingTop: RFValue(20)
        }}
        renderItem={_renderItem}
      />
    </Fragment>
  );
}

export default React.memo(ChannelMembers);
