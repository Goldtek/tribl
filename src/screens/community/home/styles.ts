import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ScrollView = styled.ScrollView`
  padding-top: 6px;
  background-color: ${({ theme }) => theme.colors.GREY};
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
`;

export const RecommendedCommunityContainer = styled.View`
  margin-top: 20px;
`;

export const RecentActivitiesList = styled.View`
  margin-top: 25px;
`;
