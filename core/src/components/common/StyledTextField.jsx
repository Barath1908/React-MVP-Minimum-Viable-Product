import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import styled from 'styled-components';

const CustomizedTextField = styled(MuiTextField)`
  & .MuiOutlinedInput-root {
    background-color: ${props => props.theme.colors?.inputBackground || '#ffffff'} !important;
    border-radius: 8px !important;
    
    & fieldset {
      border-color: ${props => props.theme.colors?.border || '#2a2d3e'} !important;
      transition: border-color 0.2s ease-in-out;
    }
    &:hover fieldset {
      border-color: ${props => props.theme.colors?.primary || '#7c5cbf'} !important;
    }
    &.Mui-focused fieldset {
      border-color: ${props => props.theme.colors?.primary || '#7c5cbf'} !important;
    }
  }

  & .MuiOutlinedInput-input {
    color: ${props => props.theme.colors?.textPrimary || '#1a1d27'} !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
    
    &:focus {
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
    }
  }

  & .MuiInputLabel-root {
    color: ${props => props.theme.colors?.textSecondary || '#5a5d6e'} !important;
    transition: color 0.2s ease-in-out;
    
    &.Mui-focused {
      color: ${props => props.theme.colors?.primary || '#7c5cbf'} !important;
    }
    
    &.MuiInputLabel-shrink {
      background-color: #ffffff !important;
      padding: 0 4px !important;
      margin-left: 0 !important;
    }
  }

  & .MuiInputAdornment-root {
    color: #6a6d7c !important;
  }

  & .MuiSvgIcon-root {
    color: #6a6d7c !important;
  }
`;

export const StyledTextField = React.forwardRef((props, ref) => {
  return <CustomizedTextField ref={ref} fullWidth variant="outlined" {...props} />;
});

export default StyledTextField;
