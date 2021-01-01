import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  margin-top: 10px;
`;

export const MenuBadgeWrapper = styled.View`
  width: ${RFValue(13)}px;
  height: ${RFValue(13)}px;
  border-radius: ${RFValue(13)}px;
  background-color: ${({ theme }) => theme.colors.RED};
  position: absolute;
  top: ${RFValue(10)}px;
  right: ${RFValue(5)}px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.WHITE};
`;
