const darkTheme = {
  name: 'dark',

  // -- Colors --------------------------------------------------
  colors: {
    // Backgrounds
    background:     '#0f1117',
    backgroundCard: '#1a1d27',
    backgroundHover:'#22263a',

    // Sidebar
    sidebar:        '#13151f',
    sidebarHover:   '#1e2130',

    // Header
    header:         '#13151f',

    // Text
    textPrimary:    '#e8eaf6',
    textSecondary:  '#9094a6',
    textMuted:      '#5c6070',
    textInverse:    '#0f1117',

    // Brand / Primary
    primary:        '#4f8ef7',
    primaryHover:   '#3a7ae0',
    primaryLight:   '#1a2d4f',

    // Accent
    accent:         '#7c5cbf',
    accentHover:    '#6a4daa',

    // Status
    success:        '#2ecc71',
    successLight:   '#1a3d2b',
    warning:        '#f39c12',
    warningLight:   '#3d2e0f',
    danger:         '#e74c3c',
    dangerLight:    '#3d1a1a',
    info:           '#3498db',
    infoLight:      '#1a2d3d',

    // Border
    border:         '#2a2d3e',
    borderLight:    '#1e2130',

    // Input
    inputBackground:'#1e2130',
    inputBorder:    '#2a2d3e',
    inputFocus:     '#4f8ef7',

    // Table
    tableHeader:    '#1a1d27',
    tableRow:       '#1e2130',
    tableRowHover:  '#22263a',

    // Badge
    badgeBackground:'#22263a',

    // Scrollbar
    scrollbar:      '#2a2d3e',
    scrollbarHover: '#4f8ef7',
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
    sm:  '0 1px 3px rgba(0,0,0,0.4)',
    md:  '0 4px 12px rgba(0,0,0,0.5)',
    lg:  '0 8px 24px rgba(0,0,0,0.6)',
    card:'0 2px 8px rgba(0,0,0,0.4)',
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

export default darkTheme;