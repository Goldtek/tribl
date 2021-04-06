import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';
import hexToRGB from '../../../../utils/hexToRGB';



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
export const ReactionContainer = styled.View`
    margin-vertical: 5px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
 `

export const ReactionDetailContainer = styled.View`
  flex-direction: row;
  align-items: center;
 `

export const ImageContainer = styled.View`
  margin-left: 15px;
  flex-direction: row;
  align-items: center;
 `
export const UserDetails = styled.Text`
  margin-horizontal: 5px;
  fontFamily: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
 `