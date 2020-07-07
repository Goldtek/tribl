import { cleanup } from '@testing-library/react-native';

jest.mock(
  'react-native-localize',
  () => require('../../__mocks__/Localize').default
);

// RESET ALL MOCKS AFTER EVERY TEST
afterEach(jest.resetAllMocks);

// CLEAN UP VIRTUAL TEST DOM AFTER ALL TEST
afterAll(cleanup);
