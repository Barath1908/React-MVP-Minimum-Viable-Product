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
`;

export default GlobalStyles;