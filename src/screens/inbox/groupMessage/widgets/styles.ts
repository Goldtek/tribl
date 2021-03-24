import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const NameContainer = styled.View`
  margin-left: ${RFValue(10)}px;
`;



export const ActionContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 80%;
  /* margin-left: ${RFValue(50)}px; */

`

export const CheckboxContainer = styled.View`
  position: absolute;
  right: 0;
  width: 10px;
  height: 10px;
  margin: 10px;
  z-index: 100;
`
