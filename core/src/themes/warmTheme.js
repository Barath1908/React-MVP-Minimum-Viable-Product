const warmTheme = {
  name: 'warm',

  // -- Colors --------------------------------------------------
  colors: {
    // Backgrounds
    background:     '#fdf6f0',
    backgroundCard: '#ffffff',
    backgroundHover:'#fef3eb',

    // Sidebar
    sidebar:        '#fff8f3',
    sidebarHover:   '#fde8d8',

    // Header
    header:         '#ffffff',

    // Text
    textPrimary:    '#2d1f14',
    textSecondary:  '#7a5c46',
    textMuted:      '#b08070',
    textInverse:    '#ffffff',

    // Brand / Primary
    primary:        '#e07b39',
    primaryHover:   '#c96a28',
    primaryLight:   '#fde8d8',

    // Accent
    accent:         '#c0392b',
    accentHover:    '#a93226',

    // Status
    success:        '#27ae60',
    successLight:   '#d5f5e3',
    warning:        '#f39c12',
    warningLight:   '#fef9e7',
    danger:         '#e74c3c',
    dangerLight:    '#fadbd8',
    info:           '#2980b9',
    infoLight:      '#d6eaf8',

    // Border
    border:         '#f0ddd0',
    borderLight:    '#fae8dc',

    // Input
    inputBackground:'#fff8f3',
    inputBorder:    '#f0ddd0',
    inputFocus:     '#e07b39',

    // Table
    tableHeader:    '#fde8d8',
    tableRow:       '#ffffff',
    tableRowHover:  '#fef3eb',

    // Badge
    badgeBackground:'#fde8d8',

    // Scrollbar
    scrollbar:      '#f0ddd0',
    scrollbarHover: '#e07b39',
  },

  // -- Typography ----------------------------------------------
  fonts: {
    primary:  "'Inter', 'Segoe UI', sans-serif",
    mono:     "'Fira Code', 'Courier New', monospace",
  },

  fontSizes: {
    xs:   '11px',
    sm:   '12px',
    md:   '14px',
    lg:   '16px',
    xl:   '18px',
    xxl:  '24px',
    xxxl: '32px',
  },

  fontWeights: {
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },

  // -- Spacing -------------------------------------------------
  spacing: {
    xs:  '4px',
    sm:  '8px',
    md:  '16px',
    lg:  '24px',
    xl:  '32px',
    xxl: '48px',
  },

  // -- Border Radius -------------------------------------------
  radius: {
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    xl:   '16px',
    full: '9999px',
  },

  // -- Shadows -------------------------------------------------
  shadows: {
    sm:  '0 1px 3px rgba(200,120,60,0.1)',
    md:  '0 4px 12px rgba(200,120,60,0.15)',
    lg:  '0 8px 24px rgba(200,120,60,0.2)',
    card:'0 2px 8px rgba(200,120,60,0.1)',
  },

  // -- Transitions ---------------------------------------------
  transitions: {
    fast:   '0.15s ease',
    normal: '0.25s ease',
    slow:   '0.4s ease',
  },

  // -- Z-Index -------------------------------------------------
  zIndex: {
    dropdown: 100,
    modal:    200,
    tooltip:  300,
    toast:    400,
  },
};

export default warmTheme;