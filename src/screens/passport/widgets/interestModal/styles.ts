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

export const Interest = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.LARGE_SIZE)}px;
  color: #8a8c92;
  text-transform: capitalize;
  text-align: center;
`;

export const BlurContents = styled.View`
  flex: 1;
  align-items: center;
  border: 1px black solid;
`;

export const InstructionButton = styled.View`
  flex: 1;
  height: ${RFValue(50)}px;
  justify-content: center;
  margin: 5px;
  border-radius: 4px;
  border-width: 1.2px;
  border-color: ${({ theme }) => theme.colors.DISABLED};
`;
