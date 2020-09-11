import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const RequestContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
  justify-content: flex-end;
`;

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  padding: ${RFValue(10)}px 0 ${RFValue(30)}px;
`;

export const TextContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.INPUT};
  align-items: center;
  text-align: center;
  padding: ${RFValue(20)}px ${RFValue(20)}px ${RFValue(10)}px;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`;
