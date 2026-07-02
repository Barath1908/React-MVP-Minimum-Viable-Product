import React, { useContext } from 'react';
import { Modal as AntdModal } from 'antd';
import { Icon } from 'semantic-ui-react';
import styled, { ThemeContext } from 'styled-components';

const CustomizedModal = styled(AntdModal)`
  .ant-modal-title {
    color: ${props => props.theme.colors?.textPrimary || '#f1f3f9'} !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    background: ${props => props.theme.colors?.backgroundCard || '#141622'} !important;
  }
`;

export const StyledModal = ({ children, title, centered = true, ...props }) => {
  const theme = useContext(ThemeContext) || {};
  const colors = theme.colors || {};

  const modalStyles = {
    content: {
      background: colors.backgroundCard || '#141622',
      border: `1px solid ${colors.border || '#2a2d3e'}`,
      borderRadius: '16px',
      padding: '28px 28px 20px',
    },
    header: {
      background: colors.backgroundCard || '#141622',
      borderBottom: `1px solid ${colors.border || '#2a2d3e'}`,
      paddingBottom: '16px',
      marginBottom: '20px',
    },
    body: { background: colors.backgroundCard || '#141622' },
    footer: {
      background: colors.backgroundCard || '#141622',
      borderTop: `1px solid ${colors.border || '#2a2d3e'}`,
      paddingTop: '16px',
      marginTop: '8px',
    },
    mask: { backdropFilter: 'blur(4px)', background: 'rgba(10,11,16,0.6)' },
  };

  return (
    <CustomizedModal
      title={title}
      centered={centered}
      closeIcon={<Icon name="close" style={{ color: theme.textSecondary || '#9094a6', fontSize: '14px' }} />}
      styles={modalStyles}
      {...props}
    >
      {children}
    </CustomizedModal>
  );
};

export default StyledModal;
