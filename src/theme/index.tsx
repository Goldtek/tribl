import React, { FunctionComponent, useContext } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {
  ThemeProvider as Provider,
  ThemeContext
} from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';

import { styledComponentTheme, paperTheme } from './types';

const ThemeProvider: FunctionComponent = ({ children }) => {
  changeNavigationBarColor(styledComponentTheme.colors.WHITE, true, true);
  return (
    <PaperProvider
      theme={paperTheme}
      settings={{ icon: (props) => <AntDesign {...props} /> }}
    >
      <Provider theme={styledComponentTheme}>{children}</Provider>
    </PaperProvider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeProvider;
