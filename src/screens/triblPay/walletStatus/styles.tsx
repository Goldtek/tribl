import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  justify-content: space-between;
`;

export const HeaderCover = styled.View`
  padding: 0 ${RFValue(15)}px;
`;

export const ErrorContainer = styled(HeaderCover)`
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`;

export const ImageErrorContainer = styled.View`
  align-items: center;
`;
