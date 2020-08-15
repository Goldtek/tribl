import React, { useMemo, Fragment } from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { RFValue } from 'react-native-responsive-fontsize';
import ChannelData from '../../../../../libs/channels/index.json';

import { Paragraph, Divider, TouchableRipple } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../theme';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelScreen(props: ScreenProp) {
  const { navigation } = props;
  const detail = props.route;
  const { communityDetails } = detail;
  const { channels } = communityDetails;

  const { colors, fonts } = useThemeContext();

  const _renderItem = useMemo(
    () => ({ item }: { item: { name: string } }) => (
      <TouchableRipple
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: RFValue(25),
          paddingBottom: RFValue(25),
          padding: RFValue(20),
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
      keyExtractor={(_item, index) => index.toString()}
    />
  );
}
