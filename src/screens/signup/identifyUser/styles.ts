import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const GradientContainer = styled(LinearGradient)`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Identity = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.LARGE_SIZE)}px;
  color: #8a8c92;
  padding: 0px 30px;
  text-transform: capitalize;
  text-align: center;
`;
