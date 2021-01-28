import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';

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
  align-items: center;
  width: 100%;
  padding-bottom: 50px;
`;

export const GifImageWrapper = styled.TouchableOpacity`
  height: 120px;
  width: 49%;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 6px;
  margin-vertical: 3px;
`;

export const GifImageWrapperPlaceholder = styled.View`
  height: 120px;
  width: 100%;
  border-radius: 2px;
  margin-right: 6px;
  margin-vertical: 3px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.light};
`;

export const LoadingWrapper = styled.View`
  flex: 1;
  height: ${DEVICE_FULL_HEIGHT / 1.4}px;
  align-items: center;
  justify-content: center;
`;

export const LoadingGiphys = styled.Text`
  font-size: ${({ theme }) => theme.fonts.LARGE_SIZE}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  margin-top: 20px;
  text-transform: capitalize;
`;
