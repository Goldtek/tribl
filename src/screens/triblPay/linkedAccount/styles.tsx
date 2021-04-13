import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(20)}px ${RFValue(15)}px 0 ${RFValue(15)}px;
`;

export const Cover = styled.View`
  flex-direction: row;
  align-items: center;
`;
