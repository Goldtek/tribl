import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const NameContainer = styled.View`
  margin-left: ${RFValue(10)}px;
`;

export const JoinContainer = styled.View`
  margin-left: auto;
  width: 40px;
  height: 25px;
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  color: ${({ theme }) => theme.colors.WHITE};
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`;

export const SendConatiner = styled.View`
  margin-left: auto;
  width: 40px;
  height: 25px;
  background-color: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.INPUT};
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`;
