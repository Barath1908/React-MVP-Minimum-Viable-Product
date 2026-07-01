import React from 'react';
import { Alert as MuiAlert } from '@mui/material';
import styled from 'styled-components';

const CustomizedAlert = styled(MuiAlert)`
  && {
    border-radius: 8px;
    margin-bottom: 16px;
    font-weight: 500;
  }
`;

export const StyledAlert = (props) => {
  return <CustomizedAlert {...props} />;
};

export default StyledAlert;
