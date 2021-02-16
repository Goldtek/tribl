import React, { Fragment } from 'react';
import { Card } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFValue } from 'react-native-responsive-fontsize';

import { Container, CardContainer } from '../styles';

export default function NewTribeSkeleton() {
  return (
    <Fragment>
      <Container>
        <Card style={{ marginTop: RFValue(5) }}>
          <Card.Content>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item alignItems="center">
                <SkeletonPlaceholder.Item
                  width={RFValue(200)}
                  height={RFValue(100)}
                  borderRadius={RFValue(4)}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </Card.Content>
        </Card>
        <Card style={{ marginTop: RFValue(5) }}>
          <CardContainer>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item alignItems="center">
                <SkeletonPlaceholder.Item
                  width={RFValue(55)}
                  height={RFValue(50)}
                  borderRadius={RFValue(4)}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  alignItems="center"
                  marginLeft={RFValue(20)}
                >
                  <SkeletonPlaceholder.Item
                    width={RFValue(80)}
                    height={RFValue(20)}
                    borderRadius={RFValue(4)}
                  />
                  <SkeletonPlaceholder.Item
                    width={RFValue(80)}
                    height={RFValue(20)}
                    borderRadius={RFValue(4)}
                    marginTop={RFValue(5)}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item margin={RFValue(20)} marginLeft="auto">
                <SkeletonPlaceholder.Item alignItems="center">
                  <SkeletonPlaceholder.Item
                    width={RFValue(80)}
                    height={RFValue(20)}
                    borderRadius={RFValue(4)}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </CardContainer>
        </Card>
      </Container>
    </Fragment>
  );
}
