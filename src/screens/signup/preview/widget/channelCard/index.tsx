import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { ChannelInterface } from '../../../../../graphql/types';
import { useThemeContext } from '../../../../../theme';

import { Cover, LeftCover, Text } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelProp extends ChannelInterface {
  showModal(): void;
}

export default function MyChannel(props: MyChannelProp) {
  const { name, community, showModal } = props;

  const { colors, fonts } = useThemeContext();

  return (
    <TouchableRipple
      onPress={showModal}
      rippleColor={colors.PRIMARY}
      style={{ marginRight: 10, borderRadius: 5 }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: community?.avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: RFValue(130), height: RFValue(80), borderRadius: 5 }}
      >
        <Cover>
          <LeftCover>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.SMALL_SIZE),
                color: colors.WHITE,
                textTransform: 'capitalize'
              }}
            >
              #{name?.length < 10 ? name : `${name?.substr(0, 10)}...`}
            </Text>
          </LeftCover>
          {/* <RightCover>
            <MaterialIcons
              name="chat-bubble-outline"
              size={12}
              color={colors.ONLINE}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.SMALL_SIZE),
                color: colors.ONLINE,
                textTransform: 'capitalize',
                marginHorizontal: RFValue(3)
              }}
            >
              {Number(messageCount)}
            </Text>
            <Feather name="trending-up" size={12} color={colors.ONLINE} />
          </RightCover> */}
        </Cover>
      </FastImage>
    </TouchableRipple>
  );
}
