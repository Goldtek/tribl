import React, { Fragment } from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import AdminBadge from '../../../../components/adminBadge';

import { CommunityCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityProp {
  name: string;
  membersCount: string;
  id: string;
  avatar: string;
  isMember: boolean;
  isModerator: boolean;
  interests: [];
  description: string;
}

export default function MyCommunity(props: MyCommunityProp) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, name, isModerator } = props;

  console.tron('pO', isModerator);

  const handleNavigation = () =>
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: props
    });

  return (
    <CommunityCover>
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
        <Fragment>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{ width: '100%', height: '100%', borderRadius: 4 }}
          />
          {isModerator == true ? (
            <AdminBadge
              style={{
                position: 'absolute',
                bottom: RFValue(-20),
                zIndex: 11099,
                right: RFValue(-25)
              }}
            />
          ) : null}
        </Fragment>
      </TouchableRipple>
    </CommunityCover>
  );
}
