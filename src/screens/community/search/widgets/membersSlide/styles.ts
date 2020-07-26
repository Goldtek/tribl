import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding-top: ${RFValue(30)}px;
  height: 100%;
`;

export const HeaderContainer = styled.View`
  flex-direction: column;
`;

export const TitleWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 ${RFValue(15)}px ${RFValue(5)}px;
`;

export const BackWrapper = styled.View`
  justify-content: center;
  flex-direction: row;
  align-self: center;
`;
