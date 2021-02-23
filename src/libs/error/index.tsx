import React from 'react';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import { crashlytics } from '../../firebase/config';

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
            exceptionHandler(e);
            RNRestart.Restart();
          }
        }
      ]
    );
  };

  const exceptionHandler = (nativeError: Error | string) => {
    // our exception handler code here
    // E.g. reporting error using crashlytics
    // @ts-ignore
    crashlytics.recordError(new Error(nativeError));
  };

  setJSExceptionHandler(errorHandler);

  setNativeExceptionHandler(exceptionHandler, true);

  return props.children;
}
