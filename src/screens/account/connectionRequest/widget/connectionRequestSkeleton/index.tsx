import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';

// DEFINE SCREEN PROP TYPES
interface ConnectionRequestkeletonProps {
  skeletonSize?: number;
}

export default function ConnectionRequestSkeleton({
  skeletonSize = 1
}: ConnectionRequestkeletonProps) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <SkeletonPlaceholder key={index.toString()}>
          <SkeletonPlaceholder.Item
            marginTop={RFValue(30)}
            marginLeft={RFValue(15)}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={RFValue(70)}
              height={RFValue(70)}
              borderRadius={RFValue(15)}
            />
            <SkeletonPlaceholder.Item
              justifyContent="center"
              marginLeft={RFValue(40)}
            >
              <SkeletonPlaceholder.Item
                width={RFValue(150)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(10)}
              />
              <SkeletonPlaceholder.Item
                width={RFValue(150)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(10)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            marginTop={RFValue(30)}
            marginLeft={RFValue(15)}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={RFValue(70)}
              height={RFValue(70)}
              borderRadius={RFValue(15)}
            />
            <SkeletonPlaceholder.Item
              justifyContent="center"
              marginLeft={RFValue(40)}
            >
              <SkeletonPlaceholder.Item
                width={RFValue(150)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(10)}
              />
              <SkeletonPlaceholder.Item
                width={RFValue(150)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(10)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            marginTop={RFValue(30)}
            marginLeft={RFValue(15)}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={RFValue(70)}
              height={RFValue(70)}
              borderRadius={RFValue(15)}
            />
            <SkeletonPlaceholder.Item
              justifyContent="center"
              marginLeft={RFValue(40)}
            >
              <SkeletonPlaceholder.Item
                width={RFValue(150)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
                marginTop={RFValue(10)}
              />
              <SkeletonPlaceholder.Item
                width={RFValue(150)}
                height={RFValue(20)}
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
