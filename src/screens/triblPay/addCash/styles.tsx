import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  justify-content: space-between;
  padding: ${RFValue(30)}px ${RFValue(15)}px 0 ${RFValue(15)}px;
`;

export const Cover = styled.View``;

export const LogoCover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CashCover = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(30)}px;
`;
