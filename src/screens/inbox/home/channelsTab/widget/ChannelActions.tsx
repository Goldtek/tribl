import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { ListActionText, ListActionTextWrapper } from './styles';

type Props = {
  handleDeleteAction: () => void;
  toggleMuteAction: () => void;
  muted: boolean;
};

function ChannelActions({
  handleDeleteAction,
  toggleMuteAction,
  muted
}: Props) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 2
      }}
    >
      <TouchableWithoutFeedback onPress={handleDeleteAction}>
        <ListActionTextWrapper color={colors.RED}>
          <ListActionText>{t(`community.chat.leave_channel`)}</ListActionText>
        </ListActionTextWrapper>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={toggleMuteAction}>
        <ListActionTextWrapper>
          <ListActionText>
            {muted ? t(`community.chat.unmute`) : t(`community.chat.mute`)}
          </ListActionText>
        </ListActionTextWrapper>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default ChannelActions;
