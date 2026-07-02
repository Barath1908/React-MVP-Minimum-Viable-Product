const lightTheme = {
  name: 'light',

  colors: {
    background: '#f5f7fa',
    backgroundCard: '#ffffff',
    backgroundHover: '#eef1f7',

    sidebar: '#ffffff',
    sidebarHover: '#e8edf5',

    header: '#ffffff',

    textPrimary: '#1a202c',
    textSecondary: '#4a5568',
    textMuted: '#a0aec0',
    textInverse: '#ffffff',

    primary: '#7c5cbf',
    primaryHover: '#6a4daa',
    primaryLight: '#ebf4ff',

    accent: '#7c5cbf',
    accentHover: '#6a4daa',

    success: '#38a169',
    successLight: '#f0fff4',
    warning: '#d69e2e',
    warningLight: '#fffff0',
    danger: '#e53e3e',
    dangerLight: '#fff5f5',
    info: '#3182ce',
    infoLight: '#ebf8ff',

    border: '#e2e8f0',
    borderLight: '#edf2f7',

    inputBackground: '#ffffff',
    inputBorder: '#cbd5e0',
    inputFocus: '#7c5cbf',

    tableHeader: '#f7fafc',
    tableRow: '#ffffff',
    tableRowHover: '#f7fafc',

    badgeBackground: '#edf2f7',

    scrollbar: '#cbd5e0',
    scrollbarHover: '#3182ce',
  },

  fonts: {
    primary: "'Inter', 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  fontSizes: {
    xs: '11px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '24px',
    xxxl: '32px',
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.1)',
    lg: '0 8px 24px rgba(0,0,0,0.12)',
    card: '0 2px 8px rgba(0,0,0,0.06)',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.25s ease',
    slow: '0.4s ease',
  },

  zIndex: {
    dropdown: 100,
    modal: 200,
    tooltip: 300,
    toast: 400,
  },
};

export default lightTheme;