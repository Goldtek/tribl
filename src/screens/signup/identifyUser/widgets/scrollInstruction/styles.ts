import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const BlurContents = styled.View`
  flex: 1;
  align-items: center;
  padding: 40px 30px 0px 30px;
  border: transparent;
`;

export const BlurContentsContainer = styled.View`
  flex-direction: row;
  background-color: transparent;
  margin-bottom: 50px;
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
  text-transform: capitalize;
  text-align: center;
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

export const CloseButtonContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: flex-end;
`;
