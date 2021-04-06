import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function Skeleton() {
  return (
    <Fragment>
      {[...Array(5)].map((_, index) => (
        <SkeletonPlaceholder key={`skeleton_${index}`}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item
              width={70}
              height={70}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={180}
                height={25}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={80}
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}
