import React, { Fragment } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Paragraph, Divider } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import ChannelData from '../../../../../libs/channels/index.json';
import RenderItems from './widget';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  return (
    <FlatList
      renderItem={({ item, index }) => (
        <RenderItems key={index} {...item} {...props} />
      )}
      data={ChannelData}
      keyExtractor={(_item, index) => index.toString()}
    />
  );
}
