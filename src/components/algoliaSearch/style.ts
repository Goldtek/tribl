import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
  margin-top: ${RFValue(5)}px;
  padding: ${RFValue(10)}px 0;
`;
