import React, { Fragment } from 'react';
import { Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';

// IMPORT FOR ALL CUSTOM STYLES
import { TextConatiner, Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface PopularUserSkeletonProp {
  skelentonSize?: number;
}

export default function PopularCommunitySkeleton({
  skelentonSize = 1
}: PopularUserSkeletonProp) {
  return (
    <Fragment>
      {[...Array(skelentonSize)].map((_, index) => (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            marginTop={10}
            marginLeft={15}
            flexDirection="row"
          >
            <SkeletonPlaceholder.Item
              width={120}
              height={120}
              borderRadius={15}
            />
            <SkeletonPlaceholder.Item justifyContent="center" marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={80}
                height={20}
                borderRadius={4}
                marginTop={20}
              />
              <SkeletonPlaceholder.Item
                width={80}
                height={20}
                borderRadius={4}
                marginTop={20}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </Fragment>
  );
}
