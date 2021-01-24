import { useRef } from 'react';
import { useThemeContext } from '../theme';

export default function useStreamChatTheme() {
  const { colors } = useThemeContext();

  const getChatStyle = () => {
    return {
      'loadingIndicator.loadingText': `color: ${colors.PRIMARY_TEXT}`,
      'messageInput.container': `backgroundColor: ${colors.WHITE}; margin: 0; padding: 0; border-radius: 0;`,
      'messageInput.sendButton': `height: 30px; width: 30px; justify-content: center; align-items: center`,
      'messageInput.sendButtonIcon': `height: 20px; width: 20px; color: ${colors.WHITE};`,
      'message.content.textContainer': `background-color:  ${colors.light}`
    };
  };

  return useRef(getChatStyle()).current;
}
