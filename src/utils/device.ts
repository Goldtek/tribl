import { Dimensions } from 'react-native';

const device = Dimensions.get('window');

export const DEVICE_FULL_WIDTH = Math.ceil(device.width);
export const DEVICE_FULL_HEIGHT = Math.ceil(device.height);
