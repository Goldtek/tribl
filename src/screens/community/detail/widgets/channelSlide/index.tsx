import React from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import ChannelData from '../../../../../libs/channels/index.json';
import RenderItems from './widget/channel';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChannelScreen(props: ScreenProp) {
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
