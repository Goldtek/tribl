import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardCompatibleView } from 'stream-chat-expo';
import { DEVICE_OS } from '../../utils/device';

export default function CustomKeyboardCompatibleView({ children }: any) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardCompatibleView
      keyboardVerticalOffset={insets.bottom}
      behavior={DEVICE_OS === 'ios' ? 'padding' : 'position'}
    >
      {children}
    </KeyboardCompatibleView>
  );
}
