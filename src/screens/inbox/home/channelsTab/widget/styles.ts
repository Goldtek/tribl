import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../../../../utils/hexToRGB';

export const Date = styled.Text`
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  font-size: 11px;
  text-align: right;
  ${({ theme }) => theme.channelPreview.date.css}
`;

export const Details = styled.View`
  flex: 1;
  padding-left: 10px;
  ${({ theme }) => theme.channelPreview.details.css}
`;

export const DetailsTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.channelPreview.detailsTop.css}
`;

export const DetailsBottom = styled(DetailsTop)`
  align-items: center;
  margin-top: 2px;
`;

export const NotificationContainer = styled(DetailsTop)`
  align-items: center;
`;

export const StyledMessage = styled.Text<{ unread?: number }>`
  color: ${({ theme, unread }) =>
    unread
      ? theme.channelPreview.message.unreadColor
      : theme.channelPreview.message.color};
  font-size: ${({ theme }) => RFValue(theme.fonts.SMALL_SIZE + 1)}px;
  font-weight: ${({ theme, unread }) =>
    unread
      ? theme.channelPreview.message.unreadFontWeight
      : theme.channelPreview.message.fontWeight};
  ${({ theme }) => theme.channelPreview.message.css}
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE - 1)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  ${({ theme }) => theme.channelPreview.title.css}
`;

export const ListActionText = styled.Text`
  color: ${({ theme }) => theme.colors.WHITE};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE - 1)}px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const ListActionTextWrapper = styled.View<{ color?: string }>`
  width: 70px;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${({ theme, color }) =>
    color ? color : theme.colors.PRIMARY};
`;

export const ActionContainer = styled.View`
  flex-direction: row;
`;

export const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: ${({ theme }) => hexToRGB(theme.colors.BLACK, 0.7)};
`;

export const ModalContentWrapper = styled.View`
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const LoaderMessage = styled.Text`
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE}px;
`;
