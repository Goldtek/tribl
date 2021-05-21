import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native-paper';
import { useThemeContext } from '../../theme';
import { useNavigationState } from '@react-navigation/core';
import { RFValue } from 'react-native-responsive-fontsize';

import { Text, Container } from './styles';

export default function LoadingIndicatorState({
  showLoading
}: {
  showLoading?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const { routeNames, index } = useNavigationState((state) => state);
  const activeTab = routeNames[index];

  return (
    <Container>
      <ActivityIndicator size={RFValue(25)} color={colors.PRIMARY} />
      {!showLoading && (
        <Text>
          {t(
            `community.chat.${
              activeTab === 'DirectMessageTab'
                ? 'loadingDMs'
                : 'loadingChannels'
            }`
          )}
        </Text>
      )}
    </Container>
  );
}
