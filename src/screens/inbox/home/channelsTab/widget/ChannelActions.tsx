import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { ListActionText, ListActionTextWrapper } from './styles';
import { TouchableRipple } from 'react-native-paper';
import hexToRGB from '../../../../../utils/hexToRGB';

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
    </View>
  );
}

export default ChannelActions;
