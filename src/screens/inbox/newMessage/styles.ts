import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../../utils/hexToRGB';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const FilterContainer = styled.View`
  height: ${RFValue(180)}px;
  margin: 25px 0px 10px 0px;
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
  align-items: center;
  flex-direction: row;
`;

export const SearchInputContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-left: 15px;
  padding-right: 15px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fonts.SMALL_SIZE * 2}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  text-transform: capitalize;
  margin-left: 15px;
  margin-right: 15px;
`;

export const HeaderAction = styled.TouchableOpacity``;

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
  height: ${RFValue(50)}px;
  flex-direction: row;
  align-items: center;
  border-color: ${({ theme }) => theme.colors.INACTIVE};
  border-radius: 4px;
  border-width: 1px;
  padding: 0px 10px;
`;
