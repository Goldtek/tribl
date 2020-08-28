import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// DEFINE SCREEN PROP TYPES
interface ChatCardSkeletonProp {
  skeletonSize?: number;
}

function ChatCardSkeleton({ skeletonSize = 1 }: ChatCardSkeletonProp) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <SkeletonPlaceholder key={index.toString()}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            margin={10}
          >
            <SkeletonPlaceholder.Item
              width={60}
              height={60}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
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

export default React.memo(ChatCardSkeleton, () => false);
