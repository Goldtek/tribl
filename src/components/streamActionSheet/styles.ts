import styled from 'styled-components/native';
import hexToRGB from '../../utils/hexToRGB';

export const ActionSheetButtonContainer = styled.View`
  align-items: center;
  height: 50px;
  width: 100%;
  flex-direction: row;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ theme }) => theme.colors.WHITE};
  ${({ theme }) => theme.message.actionSheet.buttonContainer.css};
`;

export const ActionSheetButtonText = styled.Text`
  margin-left: 10px;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE}px;
  color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.PRIMARY};
  ${({ theme }) => theme.message.actionSheet.buttonText.css};
`;

export const ReactionItemContainer = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: ${50 / 2}px;
  background-color: ${({ theme }) => hexToRGB(theme.colors.light, 0.5)};
`;

export const ReactionListContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ReactionItemText = styled.Text`
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE * 2}px;
  color: ${({ theme }) => theme.colors.PRIMARY};
`;

export const MoreEmoji = styled.Text`
  position: absolute;
  top: 3px;
  right: 8px;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE * 1.5}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  z-index: 1;
`;
