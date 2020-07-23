import React from 'react';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import RecommendedUser from '../../../components/recommendedUser';
import RecommendedCommunity from '../../../components/recommendedCommunity';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function HomeScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  return (
    <Container>
      <RecommendedUser
        name="Peter Martin"
        address="New York, NY"
        avatar="https://picsum.photos/700"
      />
      <RecommendedCommunity />
    </Container>
  );
}
