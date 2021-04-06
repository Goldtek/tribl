import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const OptionWrapper = styled(TouchableRipple)`
  height: 60px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const LeftCover = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: ${RFValue(20)}px;
`;

export const RightCover = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: ${RFValue(20)}px;
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

export const ChannelInformationContainer = styled.View`
  margin-vertical: 10px;
  padding-horizontal: 10px;
`;

export const HeaderImageContainer = styled.View`
  height: 220px;
  padding-horizontal: 10px;
`;
