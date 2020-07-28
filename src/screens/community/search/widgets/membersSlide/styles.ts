import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding-top: ${RFValue(10)}px;
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

export const RecommendedList = styled.View`
  padding-top: ${RFValue(20)}px;
`;

export const RecommendedListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
`;
