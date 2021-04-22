import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const ButtonCover = styled.View`
  flex: 1;
  justify-content: flex-end;
  padding-bottom: 10px;
  margin: 0 15px;
`;

export const Tags = styled.View`
  background-color: ${({ theme }) => theme.colors.GREY_LIGHT};
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.INACTIVE};
  border-radius: 4px;
  padding: ${RFValue(10)}px;
  margin: 0 ${RFValue(15)}px;
`;

export const TagButtonCover = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
`;

export const InviteCover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(40)}px;
  padding: 0 ${RFValue(15)}px;
`;
