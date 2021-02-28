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

export const CommunityCover = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
  flex-direction: row;
  padding-left: ${RFValue(15)};
  padding-top: ${RFValue(10)};
`;

export const RecommendedListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
`;

export const RecommendedCommunityContainer = styled.View`
  margin-top: 20px;
`;

export const RecentActivitiesList = styled.View`
  margin-top: 25px;
`;

export const ButtonWrapper = styled.View`
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.TRANSPARENT};
  bottom: 10px;
  left: 0;
  right: 0;
`;
