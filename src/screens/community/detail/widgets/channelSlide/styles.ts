import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding-top: ${RFValue(10)}px;
`;

export const RecommendedList = styled.View`
  padding-top: ${RFValue(20)}px;
`;

export const RecommendedListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
`;

export const LoadingIndicatorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoadingChannels = styled.Text`
  font-size: ${({ theme }) => theme.fonts.LARGE_SIZE}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  margin-top: 20px;
  text-transform: capitalize;
`;
