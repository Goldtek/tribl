import { DeviceEventEmitter } from 'react-native';

const SHORT_DURATION = 2000;
const LONG_DURATION = 3500;

export const Toast = {
  SHORT_DURATION,
  LONG_DURATION,
  show: (message: string, duration = SHORT_DURATION) => {
    DeviceEventEmitter.emit('showToaster', {
      message,
      duration: duration
    });
  }
};
