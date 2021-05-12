import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import hexToRGB from '../../../utils/hexToRGB';

export const Container = styled.View``;

export const IconContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(15)}px;
  background-color: ${({ theme }) => hexToRGB(theme.colors.RED, 0.3)};
`;
