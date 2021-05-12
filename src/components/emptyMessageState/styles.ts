import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Text = styled.Text`
  text-align: center;
  line-height: ${RFValue(23)}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_REGULAR};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE)}px;
`;

export const NewMessageText = styled(Text)`
  color: ${({ theme }) => theme.colors.PRIMARY};
  text-transform: uppercase;
`;

export const NewChatButton = styled.TouchableOpacity`
  padding: 10px;
  width: 60%;
  margin-top: 20px;
  border: 1px ${({ theme }) => theme.colors.INACTIVE} solid;
  border-radius: 5px;
`;
