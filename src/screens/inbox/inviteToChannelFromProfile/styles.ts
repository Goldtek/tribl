import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: 0 ${RFValue(15)}px ${RFValue(15)}px;
  margin-top: 0;
`;

export const ButtonCover = styled.View`
  margin-bottom: ${RFValue(10)}px;
  margin-top: 0;
`;
