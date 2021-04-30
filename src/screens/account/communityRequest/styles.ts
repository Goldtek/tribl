import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(15)}px ${RFValue(10)}px;
  margin-top: 10px;
`;

export const ModalCover = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding: 0 ${RFValue(10)}px ${RFValue(30)}px;
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
