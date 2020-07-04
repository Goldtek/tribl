import 'styled-components';

// All app colors
enum COLORS {
  WHITE = '#FFFFFF',
  SUCCESS = '#2AC769',
  WARNING = '#F6A609',
  PRIMARY = '#718CFB',
  SECONDARY = '#A875FF',
  PRIMARY_TEXT = '#535D7E',
  SECONDARY_TEXT = '#A9AEBE',
  INACTIVE = '#DADAED',
  DISABLED = '#E8E8E8'
}

// All app font sizes
enum FONTS {
  SMALL_SIZE = 8,
  MEDIUM_SIZE = 12,
  LARGE_SIZE = 16,
  WORK_SANS_REGULAR = 'workSansRegular',
  WORK_SANS_MEDIUM = 'workSansMedium',
  WORK_SANS_SEMI_BOLD = 'workSansSemiBold',
  WORK_SANS_BOLD = 'workSansBold'
}

declare module 'styled-components' {
  export interface DefaultTheme {
    // All Global App Colors
    colors: {
      WHITE: string;
      SUCCESS: string;
      WARNING: string;
      PRIMARY: string;
      SECONDARY: string;
      PRIMARY_TEXT: string;
      SECONDARY_TEXT: string;
      INACTIVE: string;
      DISABLED: string;
    };

    // All Global App Font Sizes
    fonts: {
      SMALL_SIZE: number;
      MEDIUM_SIZE: number;
      LARGE_SIZE: number;
      WORK_SANS_REGULAR: string;
      WORK_SANS_MEDIUM: string;
      WORK_SANS_SEMI_BOLD: string;
      WORK_SANS_BOLD: string;
    };
  }
}

// App theme
export const theme = { colors: COLORS, fonts: FONTS };
