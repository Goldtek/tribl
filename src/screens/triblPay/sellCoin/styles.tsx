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

export const Overlay = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const ModalContentWrapper = styled.View`
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const LoaderMessage = styled.Text`
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE}px;
`;
