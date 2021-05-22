import Constants from 'expo-constants';
import { Surface } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ChatContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const HeaderContainer = styled.View`
  width: 100%;
  height: ${RFValue(40)}px;
  margin-top: ${Constants.statusBarHeight}px;
  flex-direction: row;
  padding-bottom: 10px;
  align-items: center;
  z-index: 999;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.DISABLED};
  border-top-color: transparent;
`;

export const CountBadge = styled(Surface)`
  max-height: 30px;
  padding-horizontal: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  border-radius: 4px;
  position: absolute;
  right: -10px;
  z-index: 99999;
  overflow: hidden;
`;

export const MessageListContainer = styled.View`
  flex: 1;
  margin-top: 80px;
  position: relative;
`;

export const HeaderTitleContainer = styled.View<{ count: number }>`
  flex: 1;
  margin-left: ${({ count }) => (count === 1 ? -20 : count >= 3 ? 15 : 0)}px;
`;
