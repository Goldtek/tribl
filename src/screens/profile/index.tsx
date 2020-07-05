import React from 'react';
import { NavigationInterface } from '../types';
import { Button } from 'react-native-paper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, Welcome } from './styles';

// DEFINE SCREEN PROP TYPES
interface ProfileScreenProp extends NavigationInterface {
  testID?: string;
}
export default function ProfileScreen(props: ProfileScreenProp) {
  return (
    <Container>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log('Pressed')}
      >
        Press me
      </Button>
      <Welcome>Profile Screen</Welcome>
    </Container>
  );
}
