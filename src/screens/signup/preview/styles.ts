import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ScrollView = styled.ScrollView`
  margin-top: 6px;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const RecommendedList = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding-top: ${RFValue(20)}px;
`;

export const RecommendedListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: ${RFValue(10)}px;
`;

export const RecommendedCommunityContainer = styled.View`
  margin-top: 10px;
`;
