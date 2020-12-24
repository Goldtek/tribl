import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.GREY};
  padding-top: ${RFValue(15)}px;
`;

export const SearchInput = styled.View`
  height: ${RFValue(40)}px;
  flex-direction: row;
  align-items: center;
  border-color: ${({ theme }) => theme.colors.INACTIVE};
  border-radius: 4px;
  border-width: 1px;
  margin: 0px 10px;
  padding: 0px 10px;
`;
