import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: ${RFValue(15)}px;
`;

export const RightCover = styled.View`
  margin: 0 ${RFValue(15)}px 0 ${RFValue(10)}px;
`;

export const TextContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ButtonCover = styled.View`
  flex-direction: row;
  margin-top: ${RFValue(5)}px;
`;
