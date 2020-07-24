import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const TextContainer = styled.View`
  margin-left: 15px;
  margin-bottom: 5px;
`;

export const AvatarContainer = styled.View``;

export const OnlineNotifier = styled.View`
  width: ${RFValue(15)}px;
  height: ${RFValue(15)}px;
  border-radius: ${RFValue(15)}px;
  background-color: ${({ theme }) => theme.colors.ONLINE};
  position: absolute;
  border: 3px ${({ theme }) => theme.colors.WHITE} solid;
  right: -8px;
  bottom: -4px;
`;

export const Time = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_REGULAR};
  font-size: ${({ theme }) => RFValue(Math.ceil(theme.fonts.MEDIUM_SIZE))}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  text-align: right;
`;

export const ActivityTimeContainer = styled.View`
  flex: 1;
`;
