import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// DEFINE SCREEN PROP TYPES
interface PopularUserSkeletonProp {
  skeletonSize?: number;
}

export default function PopularCommunitySkeleton({
  skeletonSize = 1
}: PopularUserSkeletonProp) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <SkeletonPlaceholder key={index.toString()}>
          <SkeletonPlaceholder.Item
            marginTop={10}
            marginLeft={15}
            flexDirection="row"
          >
            <SkeletonPlaceholder.Item
              width={120}
              height={120}
              borderRadius={15}
            />
            <SkeletonPlaceholder.Item justifyContent="center" marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={80}
                height={20}
                borderRadius={4}
                marginTop={20}
              />
              <SkeletonPlaceholder.Item
                width={80}
                height={20}
                borderRadius={4}
                marginTop={20}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}
