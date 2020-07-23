import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const IconContainer = styled.View`
  flex: 1;
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  justify-content: center;
  align-items: center;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE - 2)}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_MEDIUM};
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  padding-top: 3px;
  text-align: center;
  text-transform: capitalize;
`;
