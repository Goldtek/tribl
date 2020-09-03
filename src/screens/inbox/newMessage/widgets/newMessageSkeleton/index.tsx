import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// DEFINE SCREEN PROP TYPES
interface NewMessageSkeletonProps {
  skeletonSize?: number;
}

export default function NewMessageSkeleton({
  skeletonSize = 1
}: NewMessageSkeletonProps) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <SkeletonPlaceholder key={index.toString()}>
          <SkeletonPlaceholder.Item
            marginTop={30}
            marginLeft={15}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={70}
              height={70}
              borderRadius={15}
            />
            <SkeletonPlaceholder.Item justifyContent="center" marginLeft={40}>
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
                borderRadius={4}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
                borderRadius={4}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            marginTop={30}
            marginLeft={15}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={70}
              height={70}
              borderRadius={15}
            />
            <SkeletonPlaceholder.Item justifyContent="center" marginLeft={40}>
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
                borderRadius={4}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
                borderRadius={4}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            marginTop={30}
            marginLeft={15}
            flexDirection="row"
            alignItems="center"
          >
            <SkeletonPlaceholder.Item
              width={70}
              height={70}
              borderRadius={15}
            />
            <SkeletonPlaceholder.Item justifyContent="center" marginLeft={40}>
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
                borderRadius={4}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
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
