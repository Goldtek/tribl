import styled from 'styled-components/native';

const Overlay = styled.TouchableOpacity`
  flex: 1;
	align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.7);
`
const PickerContainer = styled.View`
	flex-direction: column;
  border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.WHITE};
`
const BoardContainer = styled.View`
  flex-direction: row;
`
const InnerWrapper = styled.View`
	width: 100%;
	height: 300px;
`
export { Overlay, PickerContainer, BoardContainer, InnerWrapper }