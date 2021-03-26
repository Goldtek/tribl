import React, { Fragment } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// DEFINE SCREEN PROP TYPES
interface NewMessageSkeletonProps {
  skeletonSize?: number;
}

export default function GroupMessageSkeleton({
  skeletonSize = 5
}: NewMessageSkeletonProps) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <SkeletonPlaceholder key={index.toString()}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            height={RFValue(60)}
            marginHorizontal={RFValue(10)}
          >
            <SkeletonPlaceholder.Item
              width={RFValue(50)}
              height={RFValue(50)}
              borderRadius={RFValue(4)}
            />
            <SkeletonPlaceholder.Item marginLeft={RFValue(20)}>
              <SkeletonPlaceholder.Item
                width={RFValue(110)}
                height={RFValue(15)}
              />
              <SkeletonPlaceholder.Item
                marginTop={RFValue(5)}
                width={RFValue(150)}
                height={RFValue(7)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}
