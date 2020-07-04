import React, { FunctionComponent, useContext } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  ThemeProvider as Provider,
  ThemeContext
} from 'styled-components/native';
import { theme } from './types';

const ThemeProvider: FunctionComponent = ({ children }) => {
  return (
    <PaperProvider>
      <Provider theme={theme}>{children}</Provider>
    </PaperProvider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeProvider;
