import React from 'react';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';

type GlobalErrorProps = {
  children: React.ReactElement;
};

export default function GlobalErrorBoundary(props: GlobalErrorProps) {
  const errorHandler = (e: Error, isFatal: boolean) => {
    if (!isFatal) return;

    Alert.alert(
      'Unexpected error occurred',
      `
  Something went wrong 😞😞😞 \nand we sincerely apologize for this. \nWe have reported this to our team!\n Please close the app and start again!
  `,
      [
        {
          text: 'Close',
          onPress: () => {
            exceptionHandler(e.message);
            RNRestart.Restart();
          }
        }
      ]
    );
  };

  const exceptionHandler = (nativeError: string) => {
    // our exception handler code here
    // E.g. reporting error using sentry
  };

  setJSExceptionHandler(errorHandler);

  setNativeExceptionHandler(exceptionHandler, true);

  return props.children;
}
