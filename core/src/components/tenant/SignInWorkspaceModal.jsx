import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Form } from 'antd';
import { InputAdornment } from '@mui/material';
import { Icon } from 'semantic-ui-react';
import tenantService from '../../services/tenantService';
import {
  StyledButton,
  StyledTextField,
  StyledModal,
  StyledAlert,
} from '../common';

const RECENT_WORKSPACE_KEY = 'recent_workspace_subdomain';

const GlobeCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px auto 18px;
  background: ${({ theme }) => theme.colors?.primaryGradient || 'linear-gradient(135deg, #7c5cbf, #4f8ef7)'};

  i.icon {
    margin: 0 !important;
    color: #ffffff;
    font-size: 22px;
  }
`;

const HeaderText = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const UrlPreview = styled.div`
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors?.backgroundHover || 'rgba(124,92,191,0.06)'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#2a2d3e'};
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.primary || '#7c5cbf'};
  word-break: break-all;

  i.icon {
    margin: 0 !important;
    font-size: 14px;
  }
`;

const RecentChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#2a2d3e'};
  background: transparent;
  color: ${({ theme }) => theme.colors?.textSecondary || '#9094a6'};
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || '#7c5cbf'};
    color: ${({ theme }) => theme.colors?.primary || '#7c5cbf'};
  }

  i.icon {
    margin: 0 !important;
    font-size: 11px;
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
`;

const SignInWorkspaceModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem(RECENT_WORKSPACE_KEY);
      setRecent(stored || null);
    }
  }, [open]);

  const cleanSubdomain = useMemo(
    () => subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
    [subdomain]
  );

  const handleClose = () => {
    form.resetFields();
    setSubdomain('');
    setError('');
    onClose();
  };

  const goToWorkspace = (sub) => {
    localStorage.setItem(RECENT_WORKSPACE_KEY, sub);
    window.location.href = `http://${sub}.localhost:3000/login`;
  };

  const handleContinue = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setError('');

      const sub = values.subdomain.trim().toLowerCase();
      const res = await tenantService.checkSubdomain(sub);
      const data = res?.payload?.data;

      if (data && data.available === false) {
        goToWorkspace(sub);
      } else {
        setError('Workspace subdomain not found.');
      }
    } catch (err) {
      if (err?.errorFields) return;
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={440}
      title="Sign In to Your Workspace"
    >
      <HeaderText>
        <GlobeCircle>
          <Icon name="globe" />
        </GlobeCircle>
        <p style={{ fontSize: '13px', color: '#9094a6', margin: 0 }}>
          Enter your workspace subdomain to continue to your hospital's login page.
        </p>
      </HeaderText>

      {error && <StyledAlert severity="error">{error}</StyledAlert>}

      <Form form={form} layout="vertical">
        <Form.Item
          name="subdomain"
          initialValue=""
          style={{ marginBottom: '4px' }}
          rules={[{ required: true, message: 'Please enter your workspace subdomain' }]}
        >
          <StyledTextField
            label="Workspace Subdomain"
            placeholder="apolloclinic"
            onChange={(e) => setSubdomain(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon name="building" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Form.Item>

        <UrlPreview>
          <Icon name="linkify" />
          {cleanSubdomain || 'yourworkspace'}.localhost:3000/login
        </UrlPreview>

        {recent && recent !== cleanSubdomain && (
          <RecentChip
            type="button"
            onClick={() => {
              form.setFieldsValue({ subdomain: recent });
              setSubdomain(recent);
            }}
          >
            <Icon name="history" />
            Continue as “{recent}”
          </RecentChip>
        )}
      </Form>

      <FooterRow>
        <StyledButton variant="outlined" onClick={handleClose}>
          Cancel
        </StyledButton>
        <StyledButton variant="contained" disabled={loading} onClick={handleContinue}>
          {loading ? 'Finding Workspace...' : 'Continue'}
        </StyledButton>
      </FooterRow>
    </StyledModal>
  );
};

export default SignInWorkspaceModal;