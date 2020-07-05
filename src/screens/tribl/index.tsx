import React from 'react';
import { NavigationInterface } from '../types';
import { Button } from 'react-native-paper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, Welcome } from './styles';

// DEFINE SCREEN PROP TYPES
interface TriblScreenProp extends NavigationInterface {}

export default function TriblScreen(props: TriblScreenProp) {
  return (
    <Container>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log('Pressed')}
      >
        Press me
      </Button>
      <Welcome>Tribl Screen</Welcome>
    </Container>
  );
}
