export const colors = {
  light: {
    background: '#FFFFFF',
    card: '#F8F9FA',
    border: '#E9ECEF',
    text: {
      primary: '#212529',
      secondary: '#6C757D',
      tertiary: '#ADB5BD',
    },
    primary: '#4C6EF5',
    primaryLight: '#EDF2FF',
    success: '#51CF66',
    successLight: '#E6FCF5',
    gradient: {
      start: '#4C6EF5',
      end: '#7950F2',
    },
  },
  dark: {
    background: '#1A1B1E',
    card: '#25262B',
    border: '#2C2E33',
    text: {
      primary: '#F8F9FA',
      secondary: '#ADB5BD',
      tertiary: '#6C757D',
    },
    primary: '#5C7CFA',
    primaryLight: '#2C2E33',
    success: '#63E6BE',
    successLight: '#2C2E33',
    gradient: {
      start: '#5C7CFA',
      end: '#9775FA',
    },
  },
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    huge: 64,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
