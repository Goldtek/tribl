import React, { Fragment } from 'react';
import { Card } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES

// DEFINE SCREEN PROP TYPES
interface ChannelSkeletonProp {
  skeletonSize?: number;
}

export default function ChannelSkeleton({
  skeletonSize = 1
}: ChannelSkeletonProp) {
  const { colors } = useThemeContext();

  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <Card
          key={index.toString()}
          style={{
            height: RFValue(80),
            width: RFValue(120),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: RFValue(10),
            borderWidth: 0.5,
            borderRadius: 5,
            borderColor: hexToRGB(colors.DISABLED, 0.3)
          }}
        >
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={RFValue(120)}
              height={RFValue(80)}
              borderRadius={RFValue(5)}
            />
          </SkeletonPlaceholder>
        </Card>
      ))}
    </Fragment>
  );
}
