import styled from 'styled-components/native';

const ReactionListContainer = styled.View`
  flex-direction: row;
	align-self: flex-start;
	align-items: center;
	margin-top: 5px;
	margin-bottom: 10px;
	margin-left: 10px;
	flex-wrap: wrap;
`
const ReactionItemContainer = styled.TouchableOpacity`
	border-width: 1px;
	padding: 4px;
	padding-left: 8px;
	padding-right: 8px;
	border-radius: 17px;
	margin-right: 6px;
	margin-top: 5px;
`
const StyledReactionItem = styled.Text`
	font-size: 16px;
	color: #0064c2;
`

const ReactionPickerContainer = styled.TouchableOpacity`
	padding: 6px;
	padding-left: 8px;
	padding-right: 8px;
	border-radius: 10px;
	background-color: #F0F0F0;
`

const MoreEmoji = styled.Text`
  position: absolute;
  top: 0;
  right: 0;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE * 1.25}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_MEDIUM};
  z-index: 1;
`

export { ReactionListContainer, ReactionItemContainer, StyledReactionItem, ReactionPickerContainer, MoreEmoji }