import React, { Fragment, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { StatusBar } from 'expo-status-bar';
import { tagScreenName } from '../../../utils/uxcamHelper';

import { PRIVACY_POLICY_LINK } from '../../../constants';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface PrivacyPolicyScreenProp extends NavigationInterface {}

export default function PrivacyPolicyScreen(props: PrivacyPolicyScreenProp) {
  const { colors } = useThemeContext();

  useEffect(() => {
    tagScreenName('PrivacyPolicyScreen');
  }, []);

  return (
    <Fragment>
      <StatusBar translucent animated style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
        <WebView
          source={{ uri: PRIVACY_POLICY_LINK }}
          startInLoadingState={true}
          scalesPageToFit={true}
          style={{ flex: 1 }}
          renderLoading={() => (
            <Container>
              <ActivityIndicator color={colors.PRIMARY_LIGHT} size={40} />
            </Container>
          )}
        />
      </SafeAreaView>
    </Fragment>
  );
}
