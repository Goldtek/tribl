import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';

// DEFINE SCREEN PROP TYPES
interface MyCommunityProp {
  name: string;
  membersCount: string;
  id: string;
  avatar: string;
  isMember: boolean;
  interests: [];
  description: string;
  members: string;
}

export default function MyCommunity(props: MyCommunityProp) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const {
    avatar,
    name,
    membersCount,
    isMember,
    interests,
    description,
    id
  } = props;

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
        height: RFValue(80),
        width: RFValue(80),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderWidth: RFValue(1.2),
        borderRadius: RFValue(4),
        borderColor: colors.PRIMARY,
        marginLeft: RFValue(15),
        marginRight: 15
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: '100%', height: '100%', borderRadius: RFValue(4) }}
      />
    </TouchableRipple>
  );
}
