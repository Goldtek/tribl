import styled from 'styled-components/native';
import { Alignment } from 'stream-chat-expo';

export const Container = styled.View`
  flex-direction: column;
  padding: 3px;
`;

export const UserName = styled.Text`
  color: ${({ theme }) => theme.colors.PRIMARY};
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE + 2}px;
  font-weight: bold;
`;

export const Edited = styled.Text`
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE}px;
  margin-top: 3px;
`;

export const AvatarContainer = styled.TouchableOpacity<{
  alignment: Alignment;
}>`
  margin-left: ${({ alignment }) => (alignment === 'right' ? 8 : 0)}px;
  margin-right: ${({ alignment }) => (alignment === 'left' ? 8 : 0)}px;
  ${({ theme }) => theme.message.avatarWrapper.container.css};
`;
