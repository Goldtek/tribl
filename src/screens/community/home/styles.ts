import styled from 'styled-components/native';

export const ScrollView = styled.ScrollView`
  padding-top: 6px;
  background-color: ${({ theme }) => theme.colors.GREY};
`;

export const RecommendedList = styled.View`
  padding: 25px 0px 0px 15px;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const RecommendedListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const RecommendedCommunityContainer = styled.View`
  margin-top: 20px;
`;

export const RecentActivitiesList = styled.View`
  margin-top: 25px;
  padding: 0px 15px;
`;
