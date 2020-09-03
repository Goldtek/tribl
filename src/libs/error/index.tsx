import React from 'react';
import { Alert } from 'react-native';
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
          Something went wrong 😞😞😞, and we sincerely apologize for this.
          We have reported this to our team ! Please close the app and start again!
          `,
      [{ text: 'Close', onPress: () => exceptionHandler(e.message) }]
    );
  };

  const exceptionHandler = (nativeError: string) => {
    // our exception handler code here
    // E.g. reporting error using sentry
  };

  setJSExceptionHandler(errorHandler, true);

  setNativeExceptionHandler(exceptionHandler, true);

  return props.children;
}
