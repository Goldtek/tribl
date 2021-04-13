import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';

export const Container = styled(TouchableRipple)`
  padding: 10px;
  margin-vertical: 3px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.SYSTEM_COLOR};
`;

export const DateText = styled.Text`
  color: rgba(0, 0, 0, 0.5);
  font-size: 8px;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
  ${({ theme }) => theme.messageList.messageSystem.dateText.css}
`;

export const Text = styled.Text<{ firstName?: string }>`
  font-size: ${({ theme }) => theme.fonts.SMALL_SIZE + 1}px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme, firstName }) =>
    firstName ? theme.colors.PRIMARY : ' rgba(0, 0, 0, 0.5)'};
  text-transform: uppercase;
  margin-horizontal: 2px;
  ${({ theme }) => theme.messageList.messageSystem.text.css}
`;

export const TextContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
