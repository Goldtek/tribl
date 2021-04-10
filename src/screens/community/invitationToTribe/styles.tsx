import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(15)}px;
`;

export const TagCover = styled.ScrollView`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  max-height: ${RFValue(90)}px;
  border: 1px solid ${({ theme }) => theme.colors.INPUT};
`;

export const ButtonCover = styled.View`
  margin-bottom: ${RFValue(15)}px;
`;

export const AutoTagCover = styled.View`
  flex: 1;
  left: 0;
  position: relative;
  right: 0;
  top: 0;
  z-index: 1;
`;
