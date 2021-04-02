import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../../../../utils/hexToRGB';
import { TextInput } from 'react-native-paper';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const FilterContainer = styled.View`
  height: ${RFValue(110)}px;
  margin: 25px 0px 10px 0px;
`;

export const SelectedMemberWrapper = styled.View`
  padding-vertical: 10px;
  width: ${RFValue(50)}px;
  padding-horizontal: 10px;
  margin-right: 10px;
`;

export const SelectedMemberContainer = styled.View`
  align-items: center;
`;

export const IconContainer = styled.View`
  height: ${RFValue(48)}px;
  width: ${RFValue(48)}px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => hexToRGB(theme.colors.PRIMARY, 0.3)};
`;

export const NameContainer = styled.View`
  margin-left: ${RFValue(10)}px;
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
`;

export const HeaderTitle = styled.Text`
  font-size: 20px;
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

export const InputContainer = styled.View`
  padding: 10px 0;
`;
export const SubjectInput = styled(TextInput)`
  background-color: transparent;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.PRIMARY};
`;

export const ContentWrapper = styled.View`
  padding-horizontal: 20px;
`;

export const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const LoaderMessage = styled.Text`
  color: ${({ theme }) => theme.colors.WHITE};
  margin-top: 10px;
  font-size: 14px;
`;
