import React from 'react';
import { NavigationInterface } from '../../types';
import TabViewSlide from './widgets/tabs';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SearchScreen(props: ScreenProp) {
  return (
    <Container>
      <TabViewSlide />
    </Container>
  );
}
