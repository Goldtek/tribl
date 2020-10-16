import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../../../utils/hexToRGB';
import { PassportInterface } from '../../../../graphql/types';

// DEFINE SCREEN PROP TYPES
interface MyConnectionProp extends PassportInterface {}

export default function MyCommunity(props: MyConnectionProp) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { ...restProps } = props;
  const { avatar, firstName, lastName } = restProps;

  const handleNavigation = () => {
    navigation.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: restProps
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={hexToRGB(colors.PRIMARY, 0.5)}
      style={{
        height: RFValue(70),
        width: RFValue(70),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: RFValue(10),
        borderRadius: RFValue(70)
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: '90%', height: '90%', borderRadius: RFValue(70) }}
      />
    </TouchableRipple>
  );
}
