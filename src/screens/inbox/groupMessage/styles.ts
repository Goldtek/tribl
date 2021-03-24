import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../../utils/hexToRGB';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const FilterContainer = styled.View`
  height: ${RFValue(110)}px;
  margin: 25px 0px 10px 0px;
`;

export const IconContainer = styled.View`
  height: ${RFValue(40)}px;
  width: ${RFValue(40)}px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => hexToRGB(theme.colors.PRIMARY, 0.3)};
`

export const SelectedMemberContainer = styled.View`
  /* margin-left: ${RFValue(10)}px; */
  align-items: center;
`;

export const HeaderContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-right: 20px;
`;

export const SearchInputContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
`

export const HeaderTitle = styled.Text`
  font-size: 24px;
  font-family:${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  text-transform: capitalize;
`

export const HeaderAction = styled.TouchableOpacity`

`
export const HeaderActionText = styled.Text`
  font-size: 14px;
  font-family:${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
`

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
`