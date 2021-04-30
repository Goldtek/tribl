import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// DEFINE SCREEN PROP TYPES
interface SkeletonProps {
  skeletonSize?: number;
}

export default function Skeleton({ skeletonSize = 3 }: SkeletonProps) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <SkeletonPlaceholder key={index.toString()}>
          <SkeletonPlaceholder.Item
            marginTop={20}
            marginLeft={15}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={55}
              height={55}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item justifyContent="center" marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={100}
                height={10}
                borderRadius={4}
                marginTop={5}
              />
              <SkeletonPlaceholder.Item
                width={150}
                height={15}
                borderRadius={4}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}
