import React, { Fragment } from 'react';
import { TouchableRipple } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';

// DEFINE SCREEN PROP TYPES
interface MyCommunitySkeletonProp {
  skelentonSize?: number;
}

export default function MyCommunitySkeleton({
  skelentonSize = 1
}: MyCommunitySkeletonProp) {
  const { colors } = useThemeContext();
  return (
    <Fragment>
      {[...Array(skelentonSize)].map((_, index) => (
        <TouchableRipple
          key={index}
          style={{
            height: RFValue(80),
            width: RFValue(80),
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            borderWidth: RFValue(1.2),
            borderRadius: RFValue(4),
            borderColor: colors.PRIMARY,
            marginLeft: RFValue(15)
          }}
        >
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item alignItems="center" margin={10}>
              <SkeletonPlaceholder.Item
                width={80}
                height={80}
                borderRadius={70}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </TouchableRipple>
      ))}
    </Fragment>
  );
}
