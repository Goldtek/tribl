import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { Surface } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.INPUT};
  padding: ${RFValue(10)}px ${RFValue(15)}px;
`;

export const LogoCover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CashCover = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${RFValue(30)}px;
  margin-right: ${RFValue(50)}px;
  margin-left: ${RFValue(50)}px;
`;

export const Amount = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ButtonCover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: ${RFValue(30)}px ${RFValue(15)}px;
`;
