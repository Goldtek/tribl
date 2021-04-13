import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardCompatibleView } from 'stream-chat-expo';
import { useStreamContext } from '../../stream';
import { DEVICE_OS } from '../../utils/device';

export default function CustomKeyboardCompatibleView({ children }: any) {
  const insets = useSafeAreaInsets();

  const delta = 3.5;
  const iosWithInset = insets.bottom / (delta + 1);
  const iosWithoutInset = 7;

  const iosVerticalOffset = insets.bottom > 0 ? iosWithInset : iosWithoutInset;

  return (
    <KeyboardCompatibleView
      keyboardVerticalOffset={
        DEVICE_OS === 'ios' ? iosVerticalOffset : undefined
      }
      behavior={DEVICE_OS === 'ios' ? 'padding' : 'position'}
    >
      {children}
    </KeyboardCompatibleView>
  );
}
