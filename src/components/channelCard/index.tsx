import React, { Fragment } from 'react';
import { TouchableRipple, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { ChannelInterface } from '../../graphql/types';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';

import { Cover, LeftCover, Text } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelProp extends ChannelInterface {}

export default function MyChannel(props: MyChannelProp) {
  const { id, name, community, moderators, isPrivate } = props;

  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'DeepLinkChannelChatScreen',
      params: { channelId: id, title: `${name}`, moderators, isPrivate }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
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
            <Paragraph>
              {isPrivate ? (
                <Fragment>
                  <Feather name="lock" size={12} color={colors.WHITE} />
                </Fragment>
              ) : null}
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.SMALL_SIZE),
                  color: colors.WHITE,
                  textTransform: 'none'
                }}
              >
                {name?.length < 10 ? name : `${name?.substr(0, 10)}...`}
              </Text>
            </Paragraph>
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
