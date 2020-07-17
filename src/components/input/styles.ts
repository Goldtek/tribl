import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  width: 100%;
  height: ${RFValue(60)}px;
  flex-direction: row;
  align-items: center;
  border: 1px ${({ theme }) => theme.colors.INACTIVE} solid;
  margin-top: 5px;
  border-radius: 5px;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  height: 100%;
  font-size: ${({ theme }) => RFValue(theme.fonts.LARGE_SIZE - 2)}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_REGULAR};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  background-color: ${({ theme }) => theme.colors.WHITE};
  border-radius: 4px;
`;
