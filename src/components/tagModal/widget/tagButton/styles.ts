import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

export const GradientContainer = styled(LinearGradient)`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Tag = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.LARGE_SIZE)}px;
  color: #8a8c92;
  text-transform: capitalize;
  text-align: center;
`;
