import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;

export const LeftCover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RightCover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

export const Icon = styled.Image`
    width: 30px;
    height: 30px;
    margin: 10px;
`;
