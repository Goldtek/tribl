import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  padding-left: 10px;
  margin-bottom: 10px;
  border-left-width: 5px;
  flex-direction: column;
  border-left-color: #e4e4e4;
`;

export const DetailsContainer = styled.View`
  flex-direction: column;
`;

export const TitleUrl = styled.Text`
  padding: 2px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
`;

export const Title = styled.Text`
  color: #1e75be;
  padding: 2px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
`;

export const Description = styled.Text`
  padding: 2px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_REGULAR};
`;

export const Thumbnail = styled.Image`
  width: 100%;
  height: 100px;
`;
