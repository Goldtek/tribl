import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const GradientContainer = styled(LinearGradient)`
  min-height: ${RFValue(55)}px;
  justify-content: center;
  align-items: center;
`;
