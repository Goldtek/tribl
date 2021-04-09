import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const FilterContainer = styled.View`
  margin: 10px;
`;

export const SelectedMemberWrapper = styled.View`
  width: ${RFValue(50)}px;
  margin-horizontal: 5px;
  padding-horizontal: 5px;
  margin-top: 5px;
`;

export const HeaderContainer = styled.View`
  height: ${RFValue(40)}px;
  align-items: center;
  flex-direction: row;
`;

export const SearchInputContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fonts.SMALL_SIZE * 2}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  text-transform: capitalize;
  margin-horizontal: 10px;
`;

export const HeaderAction = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
  padding-horizontal: 10px;
  align-items: center;
  align-self: flex-end;
`;

export const HeaderActionText = styled.Text<{ selectedParticipants: boolean }>`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme, selectedParticipants }) =>
    selectedParticipants ? theme.colors.PRIMARY : theme.colors.SECONDARY_TEXT};
`;

export const GroupContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 20px;
  margin-bottom: 10px;
`;

export const GroupWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.GREY};
  width: ${RFValue(70)}px;
  height: ${RFValue(50)}px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 4px 4px ${({ theme }) => theme.colors.INACTIVE};
`;

export const SearchInput = styled.View`
  flex: 1;
  height: ${RFValue(40)}px;
  flex-direction: row;
  align-items: center;
  border-color: ${({ theme }) => theme.colors.INACTIVE};
  border-radius: 4px;
  border-width: 1px;
  margin: 0px 10px;
  padding: 0px 10px;
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

export const ContentWrapper = styled.View`
  padding-horizontal: 20px;
`;

export const SearchInputWrapper = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: ${({ theme }) => theme.colors.GREY_LIGHT};
`