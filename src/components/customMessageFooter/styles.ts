import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';
import hexToRGB from '../../utils/hexToRGB';

export const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 5px;
  align-items: center;
  align-self: flex-start;
`;

export const Reaction = styled.TouchableOpacity<{ isOwnReaction: boolean }>`
  padding: 4px 8px;
  border-radius: 17px;
  margin-right: 6px;
  margin-top: 5px;
  border: 1px
    ${({ isOwnReaction, theme }) =>
      isOwnReaction ? '#0064e2' : theme.colors.TRANSPARENT}
    solid;
  background-color: ${({ isOwnReaction, theme }) =>
    isOwnReaction ? '#d6ebff' : hexToRGB(theme.colors.light, 0.8)};
`;

export const ReactionText = styled.Text`
  color: ${({ theme }) => theme.colors.PRIMARY};
  font-size: ${({ theme }) => theme.fonts.LARGE_SIZE}px;
  font-weight: bold;
`;

export const MoreReaction = styled(TouchableRipple)`
  width: 30px;
  height: 30px;
  padding: 6px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;
