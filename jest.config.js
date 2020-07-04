module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    styledComponents:
      'node_modules/styled-components/native/dist/styled-components.native.cjs.js'
  },
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/config',
    '<rootDir>/__tests__/types.d.ts'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|unimodules-permissions-interface|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|static-container)'
  ]
};
