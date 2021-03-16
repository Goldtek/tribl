import styled from 'styled-components/native';

const Container = styled.TouchableOpacity`
  margin-left: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
  border-left-width: 5px;
  flex-direction: column;
  border-left-color: #e4e4e4;
`;

const DetailsContainer = styled.View`
	flex-direction: column;
`

const TitleUrl = styled.Text`
	padding: 2px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
`
const Title = styled.Text`
	color: #1E75BE;
  padding: 2px;
	font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
`
const Description = styled.Text`
	padding: 2px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_REGULAR};
`

const Thumbnail = styled.Image`
	width: 100%;
  height: 150;
`

export { Container, DetailsContainer, TitleUrl, Title, Description, Thumbnail }