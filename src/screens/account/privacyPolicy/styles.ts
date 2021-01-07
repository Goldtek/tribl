import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const Welcome = styled.Text`
  font-size: ${({ theme }) => theme.fonts.LARGE_SIZE}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_REGULAR};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  text-transform: capitalize;
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
