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
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  padding-top: 3px;
  text-align: center;
  text-transform: capitalize;
`;

export const BadgeWrapper = styled.View`
  width: ${RFValue(7)}px;
  height: ${RFValue(7)}px;
  border-radius: ${RFValue(7)}px;
  background-color: ${({ theme }) => theme.colors.RED};
  position: absolute;
  top: -8px;
  right: ${RFValue(35)}px;
`;
