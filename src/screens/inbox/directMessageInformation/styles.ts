import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { EdgeInsets } from 'react-native-safe-area-context';
import hexToRGB from '../../../utils/hexToRGB';

export const Container = styled.View`
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

export const HeaderContainer = styled.View<{ inset: EdgeInsets }>`
  margin-top: ${({ inset }) => RFValue(inset.top)}px;
  flex-direction: row;
  align-items: center;
`;

export const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: ${({ theme }) => hexToRGB(theme.colors.BLACK, 0.7)};
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
