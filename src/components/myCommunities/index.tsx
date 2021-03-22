import React from 'react';
import { TouchableRipple, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import AdminBadge from '../../components/adminBadge';
import { PAGINATION_DEFAULT } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { CommunityInterface, PassportInterface } from '../../graphql/types';

import { TribeCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyCommunityProp extends CommunityInterface {
  singlePassport?: PassportInterface;
  lastIndex?: boolean;
}

export default function MyCommunity(props: MyCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { lastIndex, singlePassport, ...community } = props;
  const { avatar, name, isModerator } = community;

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'CommunityDetailScreen',
      params: {
        title: name,
        details: { ...community }
      }
    });
  };

  if (!lastIndex) {
    return (
      <TribeCover>
        <TouchableRipple
          onPress={handleNavigation}
          rippleColor={colors.PRIMARY}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center'
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
              bottom: 0,
              zIndex: 11099,
              right: RFValue(-25),
              position: 'absolute'
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
