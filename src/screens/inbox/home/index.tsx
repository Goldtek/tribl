import React from 'react';
import { NavigationInterface } from '../../types';
import TabSlide from './widgets/tabs';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function InboxScreen(props: ScreenProp) {
  return (
    <Container>
      <TabSlide />
    </Container>
  );
}
