import React, { Fragment } from 'react';
import { TouchableRipple, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../../../utils/hexToRGB';
import { PassportInterface } from '../../../../graphql/types';
import { USER_DEFAULT_AVATAR } from '../../../../constants';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';

// DEFINE SCREEN PROP TYPES
interface MyConnectionProp extends PassportInterface {}

export default function MyConnection(props: MyConnectionProp) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { ...restProps } = props;
  const { avatar, firstName, lastName } = restProps;

  const handleNavigation = () => {
    navigation.navigate('CommunityScreen', {
      screen: 'MemberDetailScreen',
      params: {
        title: `${firstName} ${lastName}`,
        details: restProps
      }
    });
  };

  return (
    <TouchableRipple
      ref={hideSensitiveView}
      onPress={handleNavigation}
      rippleColor={hexToRGB(colors.PRIMARY, 0.5)}
      style={{
        height: RFValue(80),
        width: RFValue(80),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RFValue(40)
      }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: avatar ? avatar : USER_DEFAULT_AVATAR,
            priority: FastImage.priority.high
          }}
          style={{
            width: '80%',
            height: '80%',
            borderRadius: RFValue(70),
            borderWidth: 2,
            borderColor: colors.PRIMARY
          }}
        />
        <Paragraph>
          {firstName?.length >= 8 ? `${firstName?.slice(0, 7)}...` : firstName}
        </Paragraph>
      </Fragment>
    </TouchableRipple>
  );
}
