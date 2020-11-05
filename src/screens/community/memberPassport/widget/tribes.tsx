import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-reanimated';

// DEFINE SCREEN PROP TYPES
interface MyCommunityProp {
  name: string;
  membersCount: string;
  id: string;
  avatar: string;
  isMember: boolean;
  interests: [];
  description: string;
}

export default function MyCommunity(props: MyCommunityProp) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, name } = props;

  const handleNavigation = () =>
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: props
    });

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{
        height: RFValue(50),
        width: RFValue(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: RFValue(10),
        borderWidth: 1.3,
        borderRadius: 5,
        borderColor: colors.PRIMARY
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: '100%', height: '100%', borderRadius: 4 }}
      />
    </TouchableRipple>
  );
}
