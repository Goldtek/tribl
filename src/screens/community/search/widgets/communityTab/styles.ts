import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding-top: ${RFValue(10)}px;
`;

export const CommunityWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${RFValue(10)}px;
  padding-left: ${RFValue(15)}px;
`;

export const PopularContainer = styled.View`
  flex: 1;
  flex-direction: column;
  padding-top: ${RFValue(20)}px;
`;

export const RecommendedList = styled.View`
  padding-top: ${RFValue(5)}px;
`;

export const RecommendedListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
`;
