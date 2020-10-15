import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';

// DEFINE SCREEN PROP TYPES
interface MyCommunityProp {
  avatar: string;
  name: string;
  firstName: string;
  lastName: string;
}

export default function MyCommunity(props: MyCommunityProp) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, firstName, lastName } = props;

  const handleNavigation = () =>
    navigation.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: props
    });

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{
        height: RFValue(70),
        width: RFValue(70),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: RFValue(15)
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: '100%', height: '100%', borderRadius: RFValue(50) }}
      />
    </TouchableRipple>
  );
}
