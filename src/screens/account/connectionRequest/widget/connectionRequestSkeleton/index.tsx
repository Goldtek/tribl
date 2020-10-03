import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';

// DEFINE SCREEN PROP TYPES
interface ConnectionRequestkeletonProps {
  skeletonSize?: number;
}

export default function ConnectionRequestSkeleton({
  skeletonSize = 3
}: ConnectionRequestkeletonProps) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <SkeletonPlaceholder key={index.toString()}>
          <SkeletonPlaceholder.Item
            marginTop={RFValue(10)}
            marginLeft={RFValue(15)}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={RFValue(50)}
              height={RFValue(50)}
              borderRadius={RFValue(5)}
            />
            <SkeletonPlaceholder.Item
              justifyContent="center"
              marginLeft={RFValue(10)}
            >
              <SkeletonPlaceholder.Item
                width={RFValue(130)}
                height={RFValue(15)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(10)}
              />
              <SkeletonPlaceholder.Item
                width={RFValue(100)}
                height={RFValue(8)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(10)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}
