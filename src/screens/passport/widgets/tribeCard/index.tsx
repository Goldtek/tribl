import React, { Fragment } from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { CommunityInterface } from '../../../../graphql/types';
import AdminBadge from '../../../../components/adminBadge';

import { TribeCover } from '../../styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityProp extends CommunityInterface {
  moderatorOf: any;
}

export default function MyCommunity(props: MyCommunityProp) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, name, isModerator } = props;

  const handleNavigation = () => {
    navigation.navigate('CommunityScreen', {
      screen: 'CommunityDetailScreen',
      params: {
        title: name,
        details: { ...props }
      }
    });
  };

  return (
    <TribeCover>
      <TouchableRipple
        onPress={handleNavigation}
        rippleColor={colors.PRIMARY}
        style={{
          height: RFValue(60),
          width: RFValue(60),
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: RFValue(10),
          borderWidth: 1.3,
          borderRadius: 5,
          borderColor: colors.PRIMARY
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{ width: '100%', height: '100%', borderRadius: 4 }}
        />
      </TouchableRipple>
      {isModerator ? (
        <AdminBadge
          style={{
            position: 'absolute',
            bottom: RFValue(0),
            zIndex: 11099,
            right: RFValue(-25)
          }}
        />
      ) : null}
    </TribeCover>
  );
}
