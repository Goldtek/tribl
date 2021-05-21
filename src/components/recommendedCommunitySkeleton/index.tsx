import React, { Fragment } from 'react';
import { Card } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';

// DEFINE SCREEN PROP TYPES
interface RecommendedCommunitySkeletonProp {
  skeletonSize?: number;
}

function RecommendedCommunitySkeleton({
  skeletonSize = 1
}: RecommendedCommunitySkeletonProp) {
  const { colors, fonts } = useThemeContext();

  return (
    <Fragment>
      {[...Array(skeletonSize)].map((_, index) => (
        <Card
          key={index.toString()}
          style={{
            width: '100%',
            height: RFValue(300),
            alignItems: 'center',
            backgroundColor: colors.GREY,
            marginTop: 3,
            elevation: 0
          }}
        >
          <Card.Content
            style={{
              width: DEVICE_FULL_WIDTH - 30,
              height: RFValue(230),
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0
            }}
          >
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                alignItems="center"
                margin={RFValue(10)}
                marginTop={RFValue(20)}
                marginBottom={RFValue(20)}
              >
                <SkeletonPlaceholder.Item
                  width={RFValue(200)}
                  height={RFValue(200)}
                  borderRadius={RFValue(4)}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </Card.Content>
          <Card.Title
            title={
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item
                      width={RFValue(80)}
                      height={RFValue(20)}
                      borderRadius={RFValue(4)}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            }
            subtitle={
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item
                      width={RFValue(80)}
                      height={RFValue(20)}
                      borderRadius={RFValue(4)}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            }
            titleStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              textTransform: 'capitalize',
              color: colors.PRIMARY_TEXT,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0
            }}
            subtitleStyle={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.SECONDARY_TEXT,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0
            }}
            left={({ size }) => (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  alignItems="center"
                  margin={RFValue(10)}
                >
                  <SkeletonPlaceholder.Item
                    width={size}
                    height={size + 2}
                    borderRadius={RFValue(4)}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            )}
            right={() => (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  alignItems="center"
                  margin={RFValue(20)}
                >
                  <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item
                      width={RFValue(80)}
                      height={RFValue(20)}
                      borderRadius={RFValue(4)}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            )}
            style={{ flex: 1, paddingLeft: 0 }}
          />
        </Card>
      ))}
    </Fragment>
  );
}

export default React.memo(RecommendedCommunitySkeleton);
