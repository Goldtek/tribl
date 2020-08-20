import React, { Fragment } from 'react';
import { Card } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import hexToRGB from '../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer, AvatarContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface RecommendedUserSkeletonProp {
  skelentonSize?: number;
}

export default function RecommendedUserSkeleton({
  skelentonSize = 1
}: RecommendedUserSkeletonProp) {
  const { colors } = useThemeContext();

  return (
    <Fragment>
      {[...Array(skelentonSize)].map((_, index) => (
        <Card
          key={index}
          style={{
            width: RFValue(DEVICE_FULL_WIDTH / 3),
            height: RFValue(200),
            alignItems: 'center',
            borderRadius: 5,
            marginBottom: 20,
            marginLeft: 15,
            borderWidth: 0.5,
            borderColor: hexToRGB(colors.DISABLED, 0.3)
          }}
        >
          <Card.Content
            style={{
              width: RFValue(DEVICE_FULL_WIDTH / 3),
              height: '100%',
              alignItems: 'center',
              paddingLeft: 0,
              paddingRight: 0
            }}
          >
            <AvatarContainer>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item alignItems="center" margin={10}>
                  <SkeletonPlaceholder.Item
                    width={70}
                    height={70}
                    borderRadius={50}
                  />
                  <SkeletonPlaceholder.Item alignItems="center" marginTop={20}>
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
            </AvatarContainer>

            <TextContainer>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item alignItems="center" margin={20}>
                  <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item
                      width={80}
                      height={20}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </TextContainer>
          </Card.Content>
        </Card>
      ))}
    </Fragment>
  );
}
