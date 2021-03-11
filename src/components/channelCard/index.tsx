import React, { Fragment, useState, useEffect } from 'react';
import { TouchableRipple, Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { ChannelInterface } from '../../graphql/types';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';

import { Cover, LeftCover, RightCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelProp extends ChannelInterface {}

export default function MyChannel(props: MyChannelProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { name, community, id, isMember } = props;

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'ChannelChatScreen',
      params: {
        title: `#${name}`,
        chatId: id,
        isMember,
        channelId: id,
        details: { ...props },
        channel: { name, community: community?.name }
      }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{
        height: RFValue(80),
        width: RFValue(120),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: RFValue(10),
        borderWidth: 1.3,
        borderRadius: 5,
        borderColor: colors.PRIMARY
      }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: community.avatar,
            priority: FastImage.priority.high
          }}
          style={{ width: '100%', height: '100%', borderRadius: 4 }}
        />
        <Cover>
          <LeftCover>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.SMALL_SIZE),
                color: colors.WHITE,
                textTransform: 'capitalize',
                lineHeight: 15
              }}
            >
              {name}
            </Title>
          </LeftCover>
          <RightCover>
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
              10
            </Text>
            <Feather name="trending-up" size={12} color={colors.ONLINE} />
          </RightCover>
        </Cover>
      </Fragment>
    </TouchableRipple>
  );
}
