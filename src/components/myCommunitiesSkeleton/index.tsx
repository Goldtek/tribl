import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';

// DEFINE SCREEN PROP TYPES
interface MyCommunitySkeletonProp {
  skeletonSize?: number;
}

import { Container } from './styles';

export default function MyCommunitySkeleton({
  skeletonSize = 1
}: MyCommunitySkeletonProp) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <Container key={index}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              alignItems="center"
              justifyContent="center"
            >
              <SkeletonPlaceholder.Item
                width={RFValue(64)}
                height={RFValue(64)}
                borderRadius={RFValue(64 / 2)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </Container>
      ))}
    </Fragment>
  );
}
