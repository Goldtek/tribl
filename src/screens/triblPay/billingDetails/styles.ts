import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

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
