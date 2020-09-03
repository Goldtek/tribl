import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';

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
            margin={RFValue(10)}
          >
            <SkeletonPlaceholder.Item
              width={RFValue(60)}
              height={RFValue(60)}
              borderRadius={RFValue(50)}
            />
            <SkeletonPlaceholder.Item marginLeft={RFValue(20)}>
              <SkeletonPlaceholder.Item
                width={RFValue(120)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
              />
              <SkeletonPlaceholder.Item
                marginTop={RFValue(6)}
                width={RFValue(80)}
                height={RFValue(20)}
                borderRadius={RFValue(4)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}

export default React.memo(ChatCardSkeleton, () => false);
