import { cleanup } from '@testing-library/react-native';

jest.mock(
  'react-native-localize',
  () => require('../../__mocks__/Localize').default
);

jest.mock(
  'react-native-device-info',
  () => require('../../__mocks__/DeviceInfo').default
);

// RESET ALL MOCKS AFTER EVERY TEST
afterEach(jest.resetAllMocks);

// CLEAN UP VIRTUAL TEST DOM AFTER ALL TEST
afterAll(cleanup);
