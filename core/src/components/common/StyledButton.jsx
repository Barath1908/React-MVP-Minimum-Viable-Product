import React from 'react';
import { Button as MuiButton } from '@mui/material';
import styled from 'styled-components';

const CustomizedButton = styled(MuiButton)`
  && {
    background: ${props => props.variant === 'contained' 
      ? (props.theme.colors?.primaryGradient || 'linear-gradient(135deg, #7c5cbf, #4f8ef7)') 
      : 'transparent'};
    color: ${props => props.variant === 'contained' ? '#ffffff' : (props.theme.colors?.primary || '#7c5cbf')};
    border: ${props => props.variant === 'outlined' ? `1px solid ${props.theme.colors?.primary || '#7c5cbf'}` : 'none'};
    border-radius: 8px;
    height: 40px;
    padding: 0 20px;
    font-weight: 600;
    text-transform: none;
    box-shadow: none;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: ${props => props.variant === 'contained' 
        ? (props.theme.colors?.primaryGradientHover || 'linear-gradient(135deg, #6a4daa, #3a7ae0)') 
        : (props.theme.colors?.primaryLight || 'rgba(124, 92, 191, 0.08)')};
      border-color: ${props => props.theme.colors?.primary || '#7c5cbf'};
      box-shadow: 0 0 10px ${props => props.theme.colors?.primary ? `${props.theme.colors.primary}40` : 'rgba(124, 92, 191, 0.25)'};
    }

    &.Mui-disabled {
      background: #2a2d3e !important;
      color: #6a6d7c !important;
      box-shadow: none;
    }
  }
`;

export const StyledButton = ({ children, ...props }) => {
  return <CustomizedButton {...props}>{children}</CustomizedButton>;
};

export default StyledButton;
