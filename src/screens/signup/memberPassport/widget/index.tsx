import React, { Fragment } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// IMPORT FOR ALL CUSTOM STYLES
import {
  ContactContainer,
  LocationContainer,
  Header,
  Connection,
  ConnectionCover
} from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberSkeletonProp {
  skeletonSize?: number;
}

export default function UserSkeleton({ skeletonSize = 1 }: MemberSkeletonProp) {
  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <ContactContainer key={index}>
          <Header>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item margin={10}>
                <SkeletonPlaceholder.Item
                  width={100}
                  height={100}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
            <ConnectionCover>
              <Connection>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item
                      width={100}
                      height={20}
                      borderRadius={4}
                    />
                    <SkeletonPlaceholder.Item
                      marginTop={6}
                      width={200}
                      height={20}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </Connection>
            </ConnectionCover>
          </Header>

          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item alignItems="center" marginTop={20}>
              <SkeletonPlaceholder.Item
                width={350}
                height={60}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>

          <LocationContainer>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item alignItems="center" marginTop={50}>
                <SkeletonPlaceholder.Item
                  width={350}
                  height={20}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginTop={15}
                  width={350}
                  height={20}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginTop={15}
                  width={350}
                  height={20}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </LocationContainer>
        </ContactContainer>
      ))}
    </Fragment>
  );
}
