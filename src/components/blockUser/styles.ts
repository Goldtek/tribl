import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: ${RFValue(22)}px;
`;

export const Cover = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
  width: 70%;
  align-items: center;
  border-radius: ${RFValue(20)}px;
  padding-top: ${RFValue(10)}px;
  margin: ${RFValue(20)}px;
  shadow-color: ${({ theme }) => theme.colors.BLACK};
  shadow-offset: {
    width: 0;
    height: ${RFValue(2)}px;
  }
  shadow-opacity: 0.25;
  shadow-radius: ${RFValue(4)}px;
  elevation: ${RFValue(5)};
`;

export const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 ${RFValue(10)}px;
`;
