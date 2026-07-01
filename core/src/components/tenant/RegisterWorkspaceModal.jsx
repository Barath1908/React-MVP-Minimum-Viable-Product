import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Form, message as antMsg } from 'antd';
import { Box, Typography, InputAdornment, IconButton, MenuItem, LinearProgress } from '@mui/material';
import { Icon } from 'semantic-ui-react';
import tenantService from '../../services/tenantService';
import {
  StyledButton,
  StyledTextField,
  StyledModal,
  StyledAlert,
} from '../common';

// ---------- helpers ----------
const slugify = (text = '') =>
  text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '').slice(0, 30);

const getPasswordStrength = (password = '') => {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const levels = [
    { label: 'Weak', color: '#e74c3c' },
    { label: 'Fair', color: '#f39c12' },
    { label: 'Good', color: '#3498db' },
    { label: 'Strong', color: '#2ecc71' },
  ];
  const idx = Math.max(0, Math.min(score - 1, levels.length - 1));
  return { score, ...levels[idx] };
};

// ---------- styled ----------
const Layout = styled.div`
  display: flex;
  position: relative;
  min-height: 480px;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.15);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  i.icon {
    margin: 0 !important;
    font-size: 12px;
  }
`;

const BrandPanel = styled.div`
  flex: 0 0 34%;
  background: ${({ theme }) => theme.colors?.primaryGradient || 'linear-gradient(135deg, #7c5cbf, #4f8ef7)'};
  color: #ffffff;
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 720px) {
    flex: none;
  }
`;

const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.18);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
  margin-bottom: 20px;

  i.icon {
    margin: 0 !important;
    font-size: 12px;
  }
`;

const PlanPrice = styled.div`
  font-size: 34px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 4px;
`;

const PlanFeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlanFeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);

  i.icon {
    margin: 2px 0 0 !important;
    font-size: 12px;
  }
`;

const UrlPreviewBox = styled.div`
  margin-top: 28px;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px dashed rgba(255, 255, 255, 0.35);
  border-radius: 10px;
`;

const UrlPreviewLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 4px;
`;

/* FIX #2:
   - overflow-wrap: break-word (not break-all) so text only breaks where
     necessary, never mid-number.
   - white-space: nowrap on the trailing ":3000" span keeps the port glued
     together; the <wbr/> in the JSX gives the browser a preferred, safe
     spot to wrap (after "localhost") instead of an arbitrary one. */
const UrlPreviewValue = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  overflow-wrap: break-word;
  word-break: normal;
  line-height: 1.4;

  span.port {
    white-space: nowrap;
  }
`;

const FormPanel = styled.div`
  flex: 1;
  padding: 36px 36px 28px;
  overflow-y: auto;
  max-height: 80vh;
  background: ${({ theme }) => theme.colors?.backgroundCard || '#141622'};
  color: ${({ theme }) => theme.colors?.textPrimary || '#f1f3f9'};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors?.textSecondary || '#9094a6'};
  margin: 26px 0 14px;

  &:first-of-type {
    margin-top: 4px;
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors?.border || '#2a2d3e'};
  }
`;

const FieldRow = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }
`;

const StrengthBarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 4px;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#2a2d3e'};
`;

/* FIX #1:
   Give every Form.Item consistent bottom spacing and, critically, style
   .ant-form-item-explain-error so it renders as a normal block with its
   own margin instead of overlapping the field below it. Since Form.Item
   no longer needs per-field inline marginBottom hacks, we standardize
   here and drop the ad-hoc values from the JSX below. */
const FormWrapper = styled.div`
 .ant-form-item {
    margin-bottom: 24px !important;
  }

  .ant-form-item-explain {
    min-height: auto !important;
  }

  .ant-form-item-explain-error {
    display: block !important;
    color: ${({ theme }) => theme.colors?.danger || '#e74c3c'} !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    padding: 4px 0 0 !important;
    margin: 0 !important;
    position: static !important;
  }
`;

// ---------- component ----------
const RegisterWorkspaceModal = ({ open, plan, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const slug = useMemo(() => slugify(companyName) || 'yourhospital', [companyName]);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const resetLocalState = () => {
    form.resetFields();
    setCompanyName('');
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setError('');

      const payload = {
        ...values,
        plan_type: plan?.key,
        theme: values.theme || 'dark',
      };

      const res = await tenantService.registerTenant(payload);
      const data = res?.payload?.data;

      if (!data?.workspace) throw new Error('Registration failed');

      antMsg.success('Workspace created!');
      resetLocalState();
      onSuccess?.(data);
    } catch (err) {
      if (err?.errorFields) return; // antd validation error, ignore
      setError(
        err?.response?.data?.payload?.message || err.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal
      open={open}
      onCancel={handleClose}
      footer={null}
      closable={false}
      width={860}
      styles={{
        content: {
          background: 'transparent',
          border: 'none',
          borderRadius: '16px',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        },
        header: { display: 'none' },
        body: { padding: 0 },
        mask: { backdropFilter: 'blur(4px)', background: 'rgba(10,11,16,0.6)' },
      }}
    >
      <Layout>
        <CloseButton onClick={handleClose} type="button">
          <Icon name="close" />
        </CloseButton>

        {/* ---------- Left brand panel ---------- */}
        <BrandPanel>
          <div>
            <PlanBadge>
              <Icon name="rocket" />
              {plan?.label || 'Pro'} Plan
            </PlanBadge>

            <PlanPrice>
              {plan?.price || '₹2,999'}
              <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.8 }}>
                {plan?.period}
              </span>
            </PlanPrice>

            <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              Everything you need to run your hospital digitally.
            </Typography>

            <PlanFeatureList>
              {(plan?.features || [
                'Unlimited staff',
                'Unlimited patients',
                'Advanced analytics',
                'Priority support',
              ]).map((f) => (
                <PlanFeatureItem key={f}>
                  <Icon name="check circle" />
                  <span>{f}</span>
                </PlanFeatureItem>
              ))}
            </PlanFeatureList>
          </div>

          <UrlPreviewBox>
            <UrlPreviewLabel>Your workspace URL</UrlPreviewLabel>
            <UrlPreviewValue>
              {slug}.localhost<wbr />
              <span className="port">:3000</span>
            </UrlPreviewValue>
          </UrlPreviewBox>
        </BrandPanel>

        {/* ---------- Right form panel ---------- */}
        <FormPanel>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Create your workspace
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#9094a6', mb: 2 }}>
            Takes less than a minute — no credit card required.
          </Typography>

          {error && <StyledAlert severity="error">{error}</StyledAlert>}

          <FormWrapper>
            <Form form={form} layout="vertical">
              <SectionLabel>Organization</SectionLabel>

              <Form.Item
                name="company_name"
                initialValue=""
                rules={[{ required: true, message: 'Please enter your hospital name' }]}
              >
                <StyledTextField
                  label="Hospital / Clinic Name"
                  placeholder="e.g. Apollo Hospitals"
                  onChange={(e) => setCompanyName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="hospital" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Form.Item>

              <Form.Item name="theme" initialValue="dark" style={{ marginTop: '34px' }}>
                <StyledTextField
                  select
                  label="Preferred Theme"
                  slotProps={{ select: { MenuProps: { disablePortal: true } } }}
                >
                  <MenuItem value="dark">🌙 Dark</MenuItem>
                  <MenuItem value="light">☀️ Light</MenuItem>
                  <MenuItem value="warm">🌅 Warm</MenuItem>
                </StyledTextField>
              </Form.Item>

              <SectionLabel>Administrator Account</SectionLabel>

              <Form.Item
                name="admin_name"
                initialValue=""
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <StyledTextField
                  label="Your Full Name"
                  placeholder="e.g. Dr. John Smith"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="user" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Form.Item>

              <Form.Item
                name="admin_email"
                initialValue=""
                style={{ marginTop: '34px' }}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <StyledTextField
                  label="Admin Email"
                  placeholder="admin@hospital.com"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="mail" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Form.Item>

              <SectionLabel>Security</SectionLabel>

              <FieldRow>
                <Form.Item
                  name="password"
                  initialValue=""
                  style={{ flex: 1 }}
                  rules={[
                    { required: true, message: 'Please enter a password' },
                    { min: 8, message: 'At least 8 characters' },
                  ]}
                >
                  <StyledTextField
                    label="Password"
                    placeholder="Min. 8 characters"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon name="lock" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" sx={{ color: '#9094a6' }}>
                              <Icon name={showPassword ? 'eye' : 'eye slash'} style={{ fontSize: '16px', margin: 0 }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="confirm_password"
                  initialValue=""
                  dependencies={['password']}
                  style={{ flex: 1 }}
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('Passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <StyledTextField
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon name="lock" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword((v) => !v)} edge="end" sx={{ color: '#9094a6' }}>
                              <Icon name={showConfirmPassword ? 'eye' : 'eye slash'} style={{ fontSize: '16px', margin: 0 }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Form.Item>
              </FieldRow>

              {password && (
                <StrengthBarWrap>
                  <LinearProgress
                    variant="determinate"
                    value={(strength.score / 4) * 100}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(124,92,191,0.15)',
                      '& .MuiLinearProgress-bar': { backgroundColor: strength.color, borderRadius: 3 },
                    }}
                  />
                  <Typography sx={{ fontSize: '11px', fontWeight: 600, color: strength.color, minWidth: '40px' }}>
                    {strength.label}
                  </Typography>
                </StrengthBarWrap>
              )}
            </Form>
          </FormWrapper>

          <FooterRow>
            <StyledButton variant="outlined" onClick={handleClose}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" disabled={loading} onClick={handleSubmit}>
              {loading ? 'Creating Workspace...' : 'Create Workspace'}
            </StyledButton>
          </FooterRow>
        </FormPanel>
      </Layout>
    </StyledModal>
  );
};

export default RegisterWorkspaceModal;