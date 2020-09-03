import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';

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
            marginTop={RFValue(10)}
            marginLeft={RFValue(15)}
            flexDirection="row"
          >
            <SkeletonPlaceholder.Item
              width={RFValue(90)}
              height={RFValue(90)}
              borderRadius={RFValue(15)}
            />
            <SkeletonPlaceholder.Item
              justifyContent="center"
              marginLeft={RFValue(20)}
            >
              <SkeletonPlaceholder.Item
                width={RFValue(80)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(20)}
              />
              <SkeletonPlaceholder.Item
                width={RFValue(80)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(20)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}
