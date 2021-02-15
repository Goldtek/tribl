import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardCompatibleView } from 'stream-chat-expo';
import { useStreamContext } from '../../stream';
import { DEVICE_OS } from '../../utils/device';

let insetsIos = 35;
let noneInsets = 0;
export default function CustomKeyboardCompatibleView({ children }: any) {
  const insets = useSafeAreaInsets();
  const { activityScreen } = useStreamContext();

  useEffect(() => {
    if (
      activityScreen === 'directMessage' ||
      activityScreen === 'directMessageThreadScreen'
    ) {
      insetsIos = insets.bottom / 2.5;
      noneInsets = 8;
    } else {
      insetsIos = insets.bottom * 3.5;
      noneInsets = 95;
    }
  }, [activityScreen]);
  const iosVerticalOffset = insets.bottom > 0 ? insetsIos : noneInsets;

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
