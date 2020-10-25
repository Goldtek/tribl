import React, { useMemo, Fragment } from 'react';
import { FlatList } from 'react-native';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, Divider, TouchableRipple } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { NavigationInterface } from '../../../../types';
import { useThemeContext } from '../../../../../theme';
import {
  GET_COMMUNITY_CHANNELS,
  GET_USER_PASSPORT
} from '../../../../../graphql/server/query';
import {
  JOIN_COMMUNITY_CHANNEL,
  LEAVE_COMMUNITY_CHANNEL,
  SEND_CHANNEL_MESSAGE
} from '../../../../../graphql/server/mutations';
import {
  ChannelInterface,
  CommunityChannelRequestInterface,
  MyPassportInterface
} from '../../../../../graphql/types';
import { useTranslation } from 'react-i18next';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const detail = props.route;
  const { communityDetails } = detail;

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const [joinChannel] = useMutation(JOIN_COMMUNITY_CHANNEL);
  const [leaveChannel] = useMutation(LEAVE_COMMUNITY_CHANNEL);
  const [sendMessage] = useMutation(SEND_CHANNEL_MESSAGE);

  const { data } = useQuery<CommunityChannelRequestInterface>(
    GET_COMMUNITY_CHANNELS,
    {
      variables: { communityId: communityDetails?.id, userId: userDetails?.id },
      fetchPolicy: 'cache-and-network',
      pollInterval: 500
    }
  );

  const handleNavigation = (item: ChannelInterface) => {
    const isMember = item.participants[0]?.id;

    if (!isMember) {
      joinChannel({ variables: { payload: { channelId: item.id } } });
      sendMessage({
        variables: {
          payload: {
            system: true,
            channelId: item.id,
            content: t(`community.chat.join`)
          }
        }
      });
    }

    navigation.navigate('ChannelChatScreen', {
      title: `#${item.name}`,
      chatId: item.id,
      isMember
    });
  };

  const _renderItem = useMemo(
    () => ({ item }: { item: ChannelInterface }) => (
      <TouchableRipple
        onPress={() => handleNavigation(item)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: RFValue(20),
          paddingTop: RFValue(25),
          paddingBottom: RFValue(25),
          backgroundColor: colors.WHITE
        }}
      >
        <Fragment>
          <Paragraph
            style={{
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {item.name}
          </Paragraph>
          <AntDesign name="caretright" size={18} color={colors.PRIMARY_TEXT} />
        </Fragment>
      </TouchableRipple>
    ),
    []
  );

  const _seperator = () => (
    <Divider style={{ borderWidth: 0.6, borderColor: colors.DISABLED }} />
  );

  return (
    <FlatList
      renderItem={_renderItem}
      data={data?.Channel}
      ItemSeparatorComponent={_seperator}
      keyExtractor={(item) => item.id}
    />
  );
}
