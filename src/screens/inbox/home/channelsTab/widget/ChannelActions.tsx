import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { ListActionText, ListActionTextWrapper } from './styles';

function ChannelActions({ handleDeleteAction, handleMuteAction, icon }: any) {
  const { colors } = useThemeContext();
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
          {icon && (
            <MaterialCommunityIcons
              name="trash-can"
              size={35}
              color={colors.WHITE}
            />
          )}
          {!icon && <ListActionText>DELETE</ListActionText>}
        </ListActionTextWrapper>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handleMuteAction}>
        <ListActionTextWrapper>
          {icon && (
            <MaterialCommunityIcons
              name="volume-off-can"
              size={35}
              color={colors.WHITE}
            />
          )}
          {!icon && <ListActionText>MUTE</ListActionText>}
        </ListActionTextWrapper>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ChannelActions;
