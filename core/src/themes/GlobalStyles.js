import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

  /* -- Reset ------------------------------------------------- */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* -- Root -------------------------------------------------- */
  :root {
    font-size: 14px;
  }

  /* -- Body -------------------------------------------------- */
  body {
    font-family:      ${({ theme }) => theme.fonts.primary};
    font-size:        ${({ theme }) => theme.fontSizes.md};
    font-weight:      ${({ theme }) => theme.fontWeights.regular};
    color:            ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.background};
    line-height:      1.6;
    -webkit-font-smoothing:  antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color ${({ theme }) => theme.transitions.normal},
                color            ${({ theme }) => theme.transitions.normal};
  }

  /* -- Typography -------------------------------------------- */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color:       ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.3;
  }

  h1 { font-size: ${({ theme }) => theme.fontSizes.xxxl}; }
  h2 { font-size: ${({ theme }) => theme.fontSizes.xxl};  }
  h3 { font-size: ${({ theme }) => theme.fontSizes.xl};   }
  h4 { font-size: ${({ theme }) => theme.fontSizes.lg};   }
  h5 { font-size: ${({ theme }) => theme.fontSizes.md};   }
  h6 { font-size: ${({ theme }) => theme.fontSizes.sm};   }

  p {
    color:       ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.7;
  }

  a {
    color:           ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition:      color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  /* -- Inputs ------------------------------------------------ */
  input, textarea, select {
    font-family:      ${({ theme }) => theme.fonts.primary};
    font-size:        ${({ theme }) => theme.fontSizes.md};
    color:            ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.inputBackground};
    border:           1px solid ${({ theme }) => theme.colors.inputBorder};
    border-radius:    ${({ theme }) => theme.radius.md};
    padding:          ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    width:            100%;
    outline:          none;
    transition:       border-color ${({ theme }) => theme.transitions.fast},
                      box-shadow   ${({ theme }) => theme.transitions.fast};

    &:focus {
      border-color: ${({ theme }) => theme.colors.inputFocus};
      box-shadow:   0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:disabled {
      opacity: 0.5;
      cursor:  not-allowed;
    }
  }

  /* -- Buttons ----------------------------------------------- */
  button {
    font-family:  ${({ theme }) => theme.fonts.primary};
    font-size:    ${({ theme }) => theme.fontSizes.md};
    font-weight:  ${({ theme }) => theme.fontWeights.medium};
    cursor:       pointer;
    border:       none;
    border-radius:${({ theme }) => theme.radius.md};
    transition:   all ${({ theme }) => theme.transitions.fast};

    &:disabled {
      opacity: 0.5;
      cursor:  not-allowed;
    }
  }

  /* -- Scrollbar --------------------------------------------- */
  ::-webkit-scrollbar {
    width:  6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background:    ${({ theme }) => theme.colors.scrollbar};
    border-radius: ${({ theme }) => theme.radius.full};

    &:hover {
      background: ${({ theme }) => theme.colors.scrollbarHover};
    }
  }

  /* -- Selection --------------------------------------------- */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color:            ${({ theme }) => theme.colors.primary};
  }

  /* -- Tables ------------------------------------------------ */
  table {
    width:           100%;
    border-collapse: collapse;
  }

  th {
    background-color: ${({ theme }) => theme.colors.tableHeader};
    color:            ${({ theme }) => theme.colors.textPrimary};
    font-weight:      ${({ theme }) => theme.fontWeights.semibold};
    font-size:        ${({ theme }) => theme.fontSizes.sm};
    text-align:       left;
    padding:          ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-bottom:    1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    color:         ${({ theme }) => theme.colors.textSecondary};
    font-size:     ${({ theme }) => theme.fontSizes.md};
    padding:       ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    background:    ${({ theme }) => theme.colors.tableRow};
    transition:    background ${({ theme }) => theme.transitions.fast};
  }

  tr:hover td {
    background: ${({ theme }) => theme.colors.tableRowHover};
  }

  /* -- Lists ------------------------------------------------- */
  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  /* -- Images ------------------------------------------------ */
  img {
    max-width: 100%;
    display:   block;
  }

  /* -- Utility ----------------------------------------------- */
  .sr-only {
    position: absolute;
    width:    1px;
    height:   1px;
    padding:  0;
    margin:   -1px;
    overflow: hidden;
    clip:     rect(0,0,0,0);
    border:   0;
  }

  .text-center  { text-align: center;  }
  .text-right   { text-align: right;   }
  .text-muted   { color: ${({ theme }) => theme.colors.textMuted}; }
  .text-primary { color: ${({ theme }) => theme.colors.primary};   }
  .text-success { color: ${({ theme }) => theme.colors.success};   }
  .text-danger  { color: ${({ theme }) => theme.colors.danger};    }
  .text-warning { color: ${({ theme }) => theme.colors.warning};   }

  /* ── Ant Design Select Dropdown Styling ───────────────────── */
  .ant-select-dropdown {
    background-color: ${({ theme }) => theme.colors.backgroundCard || theme.colors.inputBackground} !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    border-radius: 8px !important;
    padding: 4px !important;
  }
  .ant-select-item {
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    border-radius: 6px !important;
    transition: background 0.15s ease !important;
  }
  .ant-select-item-option-active {
    background-color: ${({ theme }) => theme.colors.tableRowHover || 'rgba(255, 255, 255, 0.08)'} !important;
  }
  .ant-select-item-option-selected {
    background-color: ${({ theme }) => theme.colors.primary} !important;
    color: #fff !important;
  }

  /* ── Ant Design Modal Overrides ───────────────────────────── */
  .ant-modal-content {
    background-color: ${({ theme }) => theme.colors.backgroundCard || '#1a1d27'} !important;
    border: 1px solid ${({ theme }) => theme.colors.border || '#2a2d3e'} !important;
    border-radius: 16px !important;
    padding: 24px !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6) !important;
  }
  .ant-modal-header {
    background-color: transparent !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#2a2d3e'} !important;
    padding-bottom: 16px !important;
    margin-bottom: 16px !important;
  }
  .ant-modal-title {
    color: ${({ theme }) => theme.colors.textPrimary || '#e8eaf6'} !important;
    font-family: ${({ theme }) => theme.fonts.primary} !important;
    font-size: 20px !important;
    font-weight: 700 !important;
  }
  .ant-modal-body {
    background-color: transparent !important;
  }
  .ant-modal-footer {
    background-color: transparent !important;
    border-top: 1px solid ${({ theme }) => theme.colors.border || '#2a2d3e'} !important;
    padding-top: 16px !important;
    margin-top: 16px !important;
  }
  .ant-modal-close {
    color: ${({ theme }) => theme.colors.textSecondary || '#9094a6'} !important;
    transition: color 0.15s ease !important;
    &:hover {
      color: ${({ theme }) => theme.colors.primary || '#fff'} !important;
    }
  }

  /* ── MUI Global Style Overrides ───────────────────────────── */
  
  /* Inputs & TextFields */
  .MuiTextField-root,
  .MuiInputBase-root {
    background-color: ${({ theme }) => theme.colors.inputBackground} !important;
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    border-radius: 8px !important;
  }

  .MuiInputBase-input {
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    font-family: ${({ theme }) => theme.fonts.primary} !important;
    font-size: ${({ theme }) => theme.fontSizes.md} !important;
  }

  /* Outlined Input Borders */
  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.colors.inputBorder || theme.colors.border} !important;
    border-width: 1px !important;
    border-radius: 8px !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  /* Hover & Focus Borders */
  .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.colors.primary} !important;
  }

  .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.colors.inputFocus || theme.colors.primary} !important;
    border-width: 1.5px !important;
  }

  /* Labels */
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.colors.textSecondary || theme.colors.textMuted} !important;
    font-family: ${({ theme }) => theme.fonts.primary} !important;
  }

  .MuiInputLabel-root.Mui-focused {
    color: ${({ theme }) => theme.colors.primary} !important;
  }

  .MuiInputLabel-root.MuiInputLabel-shrink {
    background-color: ${({ theme }) => theme.colors.backgroundCard || '#1a1d27'} !important;
    padding: 0 6px !important;
    margin-left: -2px !important;
  }

  .ant-modal-content .MuiInputLabel-root.MuiInputLabel-shrink {
    background-color: #13151f !important;
  }

  /* Icons / Adornments */
  .MuiInputAdornment-root {
    color: ${({ theme }) => theme.colors.textMuted} !important;
  }
  .MuiSvgIcon-root {
    color: ${({ theme }) => theme.colors.textSecondary} !important;
  }

  /* Select Popovers & Menus */
  .MuiMenu-paper {
    background-color: ${({ theme }) => theme.colors.backgroundCard || theme.colors.inputBackground} !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    border-radius: 8px !important;
    color: ${({ theme }) => theme.colors.textPrimary} !important;
  }

  .MuiMenuItem-root {
    font-family: ${({ theme }) => theme.fonts.primary} !important;
    font-size: ${({ theme }) => theme.fontSizes.md} !important;
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    transition: background-color 0.15s ease !important;
  }

  .MuiMenuItem-root:hover {
    background-color: ${({ theme }) => theme.colors.tableRowHover || 'rgba(255, 255, 255, 0.08)'} !important;
  }

  .MuiMenuItem-root.Mui-selected {
    background-color: ${({ theme }) => theme.colors.primary} !important;
    color: #fff !important;
  }

  .MuiMenuItem-root.Mui-selected:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary} !important;
  }

  /* MUI Buttons Override */
  .MuiButton-root {
    text-transform: none !important;
    font-family: ${({ theme }) => theme.fonts.primary} !important;
    font-weight: ${({ theme }) => theme.fontWeights.semibold || '600'} !important;
    border-radius: 8px !important;
  }
`;

export default GlobalStyles;