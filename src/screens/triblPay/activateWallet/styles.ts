import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(150)}px ${RFValue(15)}px 0 ${RFValue(15)}px;
`;

export const BalanceCover = styled.View`
  flex-direction: row;
  justify-content: center;
`;
