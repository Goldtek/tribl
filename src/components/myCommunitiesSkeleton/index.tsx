import React, { Fragment } from 'react';
import { TouchableRipple } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';

// DEFINE SCREEN PROP TYPES
interface MyCommunitySkeletonProp {
  skeletonSize?: number;
}

export default function MyCommunitySkeleton({
  skeletonSize = 1
}: MyCommunitySkeletonProp) {
  const { colors } = useThemeContext();
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
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
            marginLeft: RFValue(15),
            marginTop: RFValue(10)
          }}
        >
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item alignItems="center" margin={RFValue(10)}>
              <SkeletonPlaceholder.Item
                width={RFValue(80)}
                height={RFValue(80)}
                borderRadius={RFValue(70)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </TouchableRipple>
      ))}
    </Fragment>
  );
}
