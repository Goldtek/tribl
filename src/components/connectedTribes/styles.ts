import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const TextContainer = styled.View`
  align-items: center;
`;

export const AvatarContainer = styled.View`
  position: relative;
`;

export const OnlineNotifier = styled.View`
  width: ${RFValue(17)}px;
  height: ${RFValue(17)}px;
  border-radius: ${RFValue(17)}px;
  background-color: ${({ theme }) => theme.colors.ONLINE};
  position: absolute;
  border: 3px ${({ theme }) => theme.colors.WHITE} solid;
  right: 0px;
`;
