import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  justify-content: space-between;
`;

export const HeaderCover = styled.View`
  padding: 0 ${RFValue(15)}px;
`;

export const IconCover = styled.View`
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  justify-content: center;
  align-items: center;
  align-self: center;
  border-radius: 50px;
  margin-bottom: ${RFValue(30)}px;
`;
