import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { ChannelInterface } from '../../../../../graphql/types';
import { useThemeContext } from '../../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { GET_CHANNEL_MEMBERS } from '../../../../../graphql/server/query';

import { Cover, LeftCover, Text } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelProp extends ChannelInterface {}

export default function MyChannel(props: MyChannelProp) {
  const { name, community, id } = props;

  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  useQuery(GET_CHANNEL_MEMBERS, { variables: { input: { channelId: id } } });

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'ChannelChatScreen',
      params: { channelId: id, title: `#${name}` }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{ marginRight: 10, borderRadius: 5 }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.stretch}
        source={{
          uri: community?.avatar,
          priority: FastImage.priority.high
        }}
        style={{
          width: RFValue(130),
          height: RFValue(80),
          borderRadius: 5,
          justifyContent: 'flex-end'
        }}
      >
        <Cover>
          <LeftCover>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.SMALL_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              #{name.length < 10 ? name : `${name.substr(0, 10)}...`}
            </Text>
          </LeftCover>
          {/* <RightCover>
            <MaterialIcons
              name="chat-bubble-outline"
              size={12}
              color={colors.WHITE}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: fonts.MEDIUM_SIZE,
                color: colors.WHITE,
                textTransform: 'capitalize',
                marginHorizontal: 3
              }}
            >
              {Number(messageCount)}
            </Text>
          </RightCover> */}
        </Cover>
      </FastImage>
    </TouchableRipple>
  );
}
