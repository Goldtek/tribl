import React, { useState, useEffect } from 'react';
import { Button, Title } from 'react-native-paper';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeContext } from '../../theme';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';

import { Container } from './styles';
import { View } from 'react-native';
import GradientButton from '../gradientButton';
// DEFINE SCREEN PROP TYPES

export default function ErrorModal(props: any) {
  const insets = useSafeAreaInsets();
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Portal>
      <Modalize
        ref={props.modalizeErrorRef}
        modalHeight={DEVICE_FULL_HEIGHT}
        modalStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: colors.WHITE
        }}
        childrenStyle={{
          paddingBottom: insets.bottom,
          paddingTop: insets.top
        }}
        handlePosition="inside"
        panGestureEnabled={false}
      >
        <Container topInset={insets.top} bottomInset={insets.bottom}>
          <View style={{ alignItems: 'center' }}>
            <MaterialIcons
              name="error-outline"
              color={colors.WARNING}
              size={120}
            />
            <Title>An Error Occurred</Title>
          </View>
          <View style={{ width: '100%' }}>
            <GradientButton
              onPress={() => props.modalizeErrorRef.current.close()}
              style={{ height: 50 }}
              gradientContainerstyle={{
                height: 50,
                marginBottom: RFValue(30),
                marginHorizontal: RFValue(15)
              }}
              contentStyle={{ height: 50 }}
            >
              Retry
            </GradientButton>
            <Button
              onPress={() => props.modalizeErrorRef.current.close()}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                textTransform: 'capitalize'
              }}
            >
              Cancel
            </Button>
          </View>
        </Container>
      </Modalize>
    </Portal>
  );
}
