import styled from 'styled-components/native';

export const ReactionListContainer = styled.View`
  flex-direction: row;
  align-self: flex-start;
  align-items: center;
  margin-top: 5px;
  flex-wrap: wrap;
`;

export const ReactionItemContainer = styled.TouchableOpacity`
  border-width: 1px;
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 17px;
  margin-right: 6px;
  margin-top: 5px;
`;

export const StyledReactionItem = styled.Text`
  font-size: 16px;
  color: #0064c2;
`;

export const ReactionPickerContainer = styled.TouchableOpacity`
  padding: 6px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 10px;
  background-color: #f0f0f0;
`;

export const MoreEmoji = styled.Text`
  position: absolute;
  top: 0;
  right: 0;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE * 1.25}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_MEDIUM};
  z-index: 1;
`;
