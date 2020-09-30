import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  width: 100%;
  height: ${RFValue(80)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.WHITE};
  z-index: 999;
`;
export const HeaderBackTitle = styled.Text`
  font-size: ${({ theme }) => theme.fonts.LARGE_SIZE}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  position: absolute;
  right: -10px;
`;
export const HeaderLeft = styled.View`
  width: ${RFValue(50)}px;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;
export const HeaderRight = styled.View`
  width: ${RFValue(50)}px;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;
