import React from 'react';
import { TouchableRipple, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../../theme';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../../../../utils/hexToRGB';
import {
  CommunityInterface,
  PassportInterface
} from '../../../../../graphql/types';
import AdminBadge from '../../../../../components/adminBadge';
import { PAGINATION_DEFAULT } from '../../../../../constants';

import { TribeCover } from '../styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityProp extends CommunityInterface {
  singlePassport?: PassportInterface;
  lastIndex?: boolean;
}

export default function MyCommunity(props: MyCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, name, isModerator, lastIndex, singlePassport } = props;

  const handleNavigation = () => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: { ...props }
    });
  };

  if (!lastIndex) {
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

  return lastIndex &&
    Number(singlePassport?.participantOf?.length) > PAGINATION_DEFAULT / 2 ? (
    <TouchableRipple
      onPress={() => {
        navigation.navigate('DrawerScreen', {
          screen: 'CommunityListScreen',
          params: {
            details: singlePassport?.participantOf,
            title: `${singlePassport?.firstName} ${singlePassport?.lastName} Tribes`
          }
        });
      }}
      style={{
        marginHorizontal: 5,
        borderWidth: 1.3,
        borderRadius: 5,
        borderColor: hexToRGB(colors.PRIMARY, 0.5)
      }}
    >
      <Text
        style={{
          padding: 10,
          color: colors.PRIMARY,
          fontSize: fonts.LARGE_SIZE - 2,
          fontFamily: fonts.WORK_SANS_BOLD
        }}
      >
        View all
      </Text>
    </TouchableRipple>
  ) : null;
}
