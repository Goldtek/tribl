import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding-top: ${RFValue(20)}px;
  background-color: ${({ theme }) => theme.colors.GREY};
`;
