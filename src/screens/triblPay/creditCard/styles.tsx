import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(20)}px ${RFValue(15)}px 0 ${RFValue(15)}px;
`;

export const Cover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ContactContainer = styled.View`
  flex: 1;
  padding: 20px ${RFValue(15)}px;
`;

export const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const HeaderCover = styled.View`
  padding: 0 ${RFValue(15)}px;
`;

export const InputContainer = styled.View`
  margin: 10px 0px;
`;
