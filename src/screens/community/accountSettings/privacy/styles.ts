import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding-bottom: ${RFValue(15)}px;
  margin-top: ${RFValue(10)}px;
`;
