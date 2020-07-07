import React from 'react';
import { Button } from 'react-native-paper';
import { NavigationInterface } from '../../types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, Welcome } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function OTPScreen(props: ScreenProp) {
  return (
    <Container>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log('Pressed')}
      >
        Press me
      </Button>
      <Welcome>OTP Screen</Welcome>
    </Container>
  );
}
