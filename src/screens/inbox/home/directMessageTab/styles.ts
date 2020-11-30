import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableRipple } from 'react-native-paper';

export const Container = styled.View`
  padding: ${RFValue(15)}px;
`;

export const MessageRequestContainer = styled(TouchableRipple)`
  height: ${RFValue(30)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  margin-top: 5px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
`;

export const MessageRequestBadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
