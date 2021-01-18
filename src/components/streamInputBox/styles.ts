import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: -12px;
`;

export const OuterInputContainer = styled.View`
  width: 87%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.INPUT};
`;

export const InnerInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0px;
  padding: 2px 0px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.INPUT};
`;

export const SendButtonContainer = styled.View`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const IconContainer = styled(TouchableRipple)`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: ${30 / 2}px;
  margin: 5px;
`;

export const ButtonContainer = styled.TouchableOpacity`
  margin-left: 8px;
  ${({ theme }) => theme.messageInput.sendButton.css};
`;

export const InputTextSpacer = styled.View`
  margin: 15px;
`;
