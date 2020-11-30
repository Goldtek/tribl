import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const NameContainer = styled.View`
  margin-left: ${RFValue(10)}px;
`;

export const TimeStamp = styled.View`
  margin-left: auto;
  padding-right: ${RFValue(10)}px;
`;

export const BadgeWrapper = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  border-radius: ${RFValue(10)}px;
  background-color: ${({ theme }) => theme.colors.RED};
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;
