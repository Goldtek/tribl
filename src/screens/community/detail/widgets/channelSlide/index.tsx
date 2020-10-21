import React, { useMemo, Fragment } from 'react';
import { FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, Divider, TouchableRipple } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { NavigationInterface } from '../../../../types';
import { useThemeContext } from '../../../../../theme';
import { GET_COMMUNITY_CHANNELS } from '../../../../../graphql/server/query';
import { CommunityInterface } from '../../../../../graphql/types';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelScreen(props: ScreenProp) {
  const navigation = useNavigation();
  const detail = props.route;
  const { communityDetails } = detail;
  const { id } = communityDetails;
  const { colors, fonts } = useThemeContext();

  const { data } = useQuery(GET_COMMUNITY_CHANNELS, { variables: { id } });

  const channels = data?.communityChannels;

  const _renderItem = useMemo(
    () => ({ item }: { item: CommunityInterface }) => (
      <TouchableRipple
        onPress={() =>
          navigation.navigate('ChannelChatScreen', {
            title: `#${item.name}`,
            chatId: item.id
          })
        }
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
      data={channels}
      ItemSeparatorComponent={_seperator}
      keyExtractor={(item) => item.id}
    />
  );
}
