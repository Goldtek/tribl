import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../../utils/hexToRGB';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const HeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-bottom: ${RFValue(20)}px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fonts.SMALL_SIZE * 2}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  text-transform: capitalize;
  margin-left: 15px;
  margin-right: 15px;
`;

export const IconCover = styled.View`
  background-color: ${({ theme }) => theme.colors.textGrey};
  width: ${RFValue(15)}px;
  height: ${RFValue(15)}px;
  justify-content: center;
  align-items: center;
  position: relative;
  right: ${RFValue(5)}px;
  bottom: ${RFValue(3)}px;
  border-radius: 10px;
`;

export const SelectedCover = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;
