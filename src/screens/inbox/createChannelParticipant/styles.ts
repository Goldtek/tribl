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

export const HeaderActionText = styled.Text<{ selectedParticipants: boolean }>`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme, selectedParticipants }) =>
    selectedParticipants ? theme.colors.PRIMARY : theme.colors.SECONDARY_TEXT};
  text-transform: capitalize;
`;

export const HeaderAction = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
  padding-horizontal: 10px;
  align-items: center;
  align-self: flex-end;
`;

export const SelectedMemberWrapper = styled.View`
  width: ${RFValue(50)}px;
  margin-horizontal: 5px;
  padding-horizontal: 5px;
  margin-top: 5px;
`;

export const SearchInputContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
`;

export const ContentWrapper = styled.View`
  padding-horizontal: 20px;
`;

export const SearchInputWrapper = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: ${({ theme }) => theme.colors.GREY_LIGHT};
`;

export const CloseIcon = styled.TouchableOpacity`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background-color: #979797;
  z-index: 1;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

export const Cover = styled.View`
  flex: 1;
`;
