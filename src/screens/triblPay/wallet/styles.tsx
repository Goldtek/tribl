import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(50)}px ${RFValue(15)}px 0 ${RFValue(15)}px;
`;

export const BalanceCover = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const ButtonCover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${RFValue(10)}px;
`;

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;

export const LeftCover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RightCover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;
