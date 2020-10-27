import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const FilterContainer = styled.View`
  height: ${RFValue(50)}px;
  margin: 25px 0px 15px 0px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
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
