const warmTheme = {
  name: 'warm',

  // -- Colors --------------------------------------------------
  colors: {
    // Backgrounds
    background:     '#fefbf0',
    backgroundCard: '#fcf4db',
    backgroundHover:'#f5e8be',

    // Sidebar
    sidebar:        '#fefbf0',
    sidebarHover:   '#fcf4db',

    // Header
    header:         '#fefbf0',

    // Text
    textPrimary:    '#2d1a09',
    textSecondary:  '#6b4d3a',
    textMuted:      '#9e7b65',
    textInverse:    '#ffffff',

    // Brand / Primary
    primary:        '#ea580c',
    primaryHover:   '#ca3e06',
    primaryLight:   '#fff7ed',
    primaryGradient:'linear-gradient(135deg, #ea580c, #f97316)',
    primaryGradientHover: 'linear-gradient(135deg, #ca3e06, #dd5a12)',

    // Accent
    accent:         '#ea580c',
    accentHover:    '#ca3e06',

    // Status
    success:        '#27ae60',
    successLight:   '#d5f5e3',
    warning:        '#f39c12',
    warningLight:   '#fff7ed',
    danger:         '#e74c3c',
    dangerLight:    '#fadbd8',
    info:           '#2980b9',
    infoLight:      '#d6eaf8',

    // Border
    border:         '#f5e3be',
    borderLight:    '#faecd2',

    // Input
    inputBackground:'#ffffff',
    inputBorder:    '#f5e3be',
    inputFocus:     '#ea580c',

    // Table
    tableHeader:    '#ffedd5',
    tableRow:       '#ffffff',
    tableRowHover:  '#fff7ed',

    // Badge
    badgeBackground:'#ffedd5',

    // Scrollbar
    scrollbar:      '#ffedd5',
    scrollbarHover: '#ea580c',
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