import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import hexToRGB from '../../../utils/hexToRGB';

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
  height: ${RFValue(40)}px;
  margin-top: ${Constants.statusBarHeight}px;
  padding-bottom: 10px;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: 10px;
  padding-horizontal: 10px;
  padding-right: 20px;
`;

export const InfoWrapper = styled.View``;

export const HeaderImageContainer = styled.View`
  flex-direction: row;
  height: ${RFValue(220)}px;
`;

export const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: ${({ theme }) => hexToRGB(theme.colors.BLACK, 0.7)};
`;

export const CoverImageOverlay = styled(Overlay)<{ color: string }>`
  position: absolute;
  background-color: ${({ theme, color }) =>
    color ? hexToRGB(color, 0.5) : hexToRGB(theme.colors.PRIMARY_LIGHT, 0.5)};
  width: 100%;
  height: 100%;
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
