import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import hexToRGB from '../../../../../utils/hexToRGB';
import { useThemeContext } from '../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import {
  ListActionText,
  ActionContainer,
  ListActionTextWrapper
} from './styles';

type ChannelActionsProps = {
  handleDeleteAction: () => void;
  toggleMuteAction: () => void;
  muted: boolean;
};

export default function ChannelActions(props: ChannelActionsProps) {
  const { handleDeleteAction, toggleMuteAction, muted } = props;
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  return (
    <ActionContainer>
      <TouchableRipple
        onPress={handleDeleteAction}
        rippleColor={hexToRGB(colors.RED, 0.3)}
      >
        <ListActionTextWrapper color={colors.RED}>
          <ListActionText>{t(`community.chat.leave_channel`)}</ListActionText>
        </ListActionTextWrapper>
      </TouchableRipple>
      <TouchableRipple
        onPress={toggleMuteAction}
        rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
      >
        <ListActionTextWrapper>
          <ListActionText>
            {muted ? t(`community.chat.unmute`) : t(`community.chat.mute`)}
          </ListActionText>
        </ListActionTextWrapper>
      </TouchableRipple>
    </ActionContainer>
  );
}
