import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import Constants from 'expo-constants';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const MessageListContainer = styled.View`
  flex: 1;
  padding-left: 5px;
  margin-top: 80px;
  position: relative;
`;

export const HeaderContainer = styled.View`
  width: 100%;
  height: ${RFValue(70)}px;
  margin-top: ${Constants.statusBarHeight}px;
  flex-direction: row;
  align-items: center;
  z-index: 999;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.DISABLED};
  border-top-color: transparent;
`;

export const GroupImageContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.INACTIVE};
`;
