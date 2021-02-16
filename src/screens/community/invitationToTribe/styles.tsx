import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(15)}px;
`;

export const TagCover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.INPUT};
`;

export const ButtonCover = styled.View`
  margin-bottom: ${RFValue(15)}px;
`;

export const AutoTagCover = styled.View`
  flex: 1;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
`;
