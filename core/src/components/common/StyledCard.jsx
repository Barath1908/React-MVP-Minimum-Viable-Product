import React from 'react';
import { Card as MuiCard, CardContent } from '@mui/material';
import styled from 'styled-components';

const CustomizedCard = styled(MuiCard)`
  && {
    background: ${props => props.theme.colors?.backgroundCard || '#141622'};
    color: ${props => props.theme.colors?.textPrimary || '#ffffff'};
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid ${props => props.theme.colors?.border || '#2a2d3e'};
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const StyledCard = ({ children, ...props }) => {
  return (
    <CustomizedCard {...props}>
      <CardContent>{children}</CardContent>
    </CustomizedCard>
  );
};

export default StyledCard;
