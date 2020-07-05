import { cleanup } from '@testing-library/react-native';

// RESET ALL MOCKS AFTER EVERY TEST
afterEach(jest.resetAllMocks);

// CLEAN UP VIRTUAL TEST DOM AFTER ALL TEST
afterAll(cleanup);
