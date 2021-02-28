import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Cover = styled.View`
  padding: 0 ${RFValue(15)}px;
`;

export const PrivateCover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const AvatarCover = styled.View`
  flex-direction: row;
  justify-content: center;
`;
