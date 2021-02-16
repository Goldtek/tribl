import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardCompatibleView } from 'stream-chat-expo';
import { useStreamContext } from '../../stream';
import { DEVICE_OS } from '../../utils/device';

let iosWithInset = 34;
let iosWithoutInset = 0;

export default function CustomKeyboardCompatibleView({ children }: any) {
  const insets = useSafeAreaInsets();
  const { activityScreen } = useStreamContext();

  useEffect(() => {
    const delta = 3.5;
    if (
      activityScreen === 'directMessage' ||
      activityScreen === 'directMessageThreadScreen'
    ) {
      iosWithInset = insets.bottom / (delta + 1);
      iosWithoutInset = 7;
    } else {
      iosWithInset = insets.bottom * delta;
      iosWithoutInset = 95;
    }
  }, [activityScreen]);

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
