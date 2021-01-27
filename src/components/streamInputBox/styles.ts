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

export const IconContainer = styled(TouchableRipple)<{ borderColor?: string }>`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: ${({ borderColor }) =>
    borderColor ? `1px solid ${borderColor}` : '0'};
  border-radius: ${30 / 2}px;
  margin: 5px;
  margin-right: ${({ borderColor }) => (borderColor ? '15px' : '5px')};
`;

export const ButtonContainer = styled.TouchableOpacity`
  margin-left: 8px;
  ${({ theme }) => theme.messageInput.sendButton.css};
`;

export const GifContainer = styled.View`
  padding-horizontal: 13px;
  /* flex-direction: row; */
  /* flex-wrap: wrap; */
  align-items: center;
  width: 100%;
  padding-bottom: 50px;
`;

export const InputWrapper = styled.View``;
export const GifImageWrapper = styled.TouchableOpacity`
  margin-horizontal: 2.5px;
  margin-vertical: 2.5px;
  width: 50%;
`;

export const HeaderWrapper = styled.View`
  margin-horizontal: 15px;
  margin-bottom: 30px;
`;
