import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding-top: ${RFValue(30)}px;
  height: 100%;
`;

export const CommunityWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const TitleWrapper = styled.View`
  padding-left: ${RFValue(15)}px;
  align-self: center;
`;

export const ViewWrapper = styled.View`
  flex-direction: row;
  align-self: center;
  margin-left: auto;
`;

export const PopularContainer = styled.View`
  flex: 1;
  flex-direction: column;
  padding-left: ${RFValue(25)}px;
  padding-right: ${RFValue(10)}px;
  padding-top: ${RFValue(20)}px;
`;
