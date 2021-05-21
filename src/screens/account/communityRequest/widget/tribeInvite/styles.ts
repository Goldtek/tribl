import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-vertical: 5px;
`;

export const RightCover = styled.View`
  flex: 1;
  margin-left: ${RFValue(10)}px;
  padding-right: ${RFValue(10)}px;
`;

export const TextContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ButtonCover = styled.View`
  flex-direction: row;
  margin-top: ${RFValue(7)}px;
`;
