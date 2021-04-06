import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Constants from 'expo-constants';

export const Container = styled(SafeAreaView)`
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
  height: 70px;
  margin-top: ${Constants.statusBarHeight}px;
  flex-direction: row;
  align-items: center;
  z-index: 999;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.DISABLED};
  border-top-color: transparent;
`;

export const HeaderTitleContainer = styled.View`
  flex: 1;
  padding-horizontal: 10px;
`;
