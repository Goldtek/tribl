import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: 0 ${RFValue(10)}px;
  width: 100%;
`;

export const SearchInput = styled.View`
  width: 100%;
  height: ${RFValue(40)}px;
  flex-direction: row;
  align-items: center;
  border-color: ${({ theme }) => theme.colors.INACTIVE};
  border-radius: 4px;
  border-width: 1px;
  padding: 0px 10px;
`;
