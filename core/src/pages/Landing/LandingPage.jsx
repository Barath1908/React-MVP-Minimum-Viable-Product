import { useState } from 'react';
import styled from 'styled-components';
import { Grid, Container, Header as SHeader, Segment, Icon, List } from 'semantic-ui-react';
import { Card, CardContent, Button, Typography, Box, Chip, TextField, MenuItem, IconButton, InputAdornment, Alert } from '@mui/material';
import { Form, message as antMsg, Modal } from 'antd';
import tenantService from '../../services/tenantService';

// ── Styled ───────────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1117 0%, #1a1d27 50%, #13151f 100%);
  color: #e8eaf6;
  font-family: 'Inter', sans-serif;
`;

const HeroSection = styled.div`
  padding: 80px 0 60px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #4f8ef7, #7c5cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #9094a6;
  max-width: 600px;
  margin: 0 auto 40px;
`;

const PlanCard = styled(Card)`
  background: ${({ $featured }) =>
    $featured
      ? 'linear-gradient(135deg, #4f8ef7, #7c5cbf) !important'
      : '#1a1d27 !important'};
  border: 1px solid ${({ $featured }) =>
    $featured ? 'transparent' : '#2a2d3e'} !important;
  border-radius: 16px !important;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(79,142,247,0.3) !important;
  }
`;

const ModalForm = styled.div`
  .ant-form-item {
    margin-bottom: 20px !important;
  }
  .ant-form-item-explain-error {
    color: #ff4d4f !important;
    font-size: 13px !important;
    margin-top: 4px !important;
  }

  .MuiOutlinedInput-root {
    background-color: #ffffff !important;
    border-radius: 8px !important;
  }
  .MuiOutlinedInput-input {
    color: #1a1d27 !important;
  }
  .MuiInputLabel-root {
    color: #5a5d6e !important;
  }
  .MuiInputLabel-root.Mui-focused {
    color: #4f8ef7 !important;
  }
  .MuiInputLabel-root.MuiInputLabel-shrink {
    background-color: #ffffff !important;
    padding: 0 4px !important;
    margin-left: 0 !important;
  }

  .MuiInputAdornment-root {
    color: #6a6d7c !important;
  }

  .MuiSvgIcon-root {
    color: #6a6d7c !important;
  }
`;

const modalStyles = {
  content: {
    background: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    padding: '28px 28px 20px',
  },
  header: {
    background: '#ffffff',
    borderBottom: '1px solid #eee',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  body: { background: '#ffffff' },
  footer: {
    background: '#ffffff',
    borderTop: '1px solid #eee',
    paddingTop: '16px',
    marginTop: '8px',
  },
  mask: { backdropFilter: 'blur(4px)', background: 'rgba(10,11,16,0.6)' },
};

const cancelBtnSx = {
  borderColor: '#2a2d3e',
  color: '#9094a6',
  borderRadius: '8px',
  mr: 1,
  height: '40px',
  px: 3,
  textTransform: 'none',
  '&:hover': { borderColor: '#4f8ef7', color: '#fff', background: 'rgba(79,142,247,0.08)' },
};

const submitBtnSx = {
  background: 'linear-gradient(135deg, #4f8ef7, #7c5cbf)',
  color: '#fff',
  borderRadius: '8px',
  height: '40px',
  px: 3,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': { background: 'linear-gradient(135deg, #3a7ae0, #6a4daa)', boxShadow: 'none' },
  '&.Mui-disabled': { background: '#2a2d3e', color: '#6a6d7c' },
};

// ── Plans Config ─────────────────────────────────────────────

const PLANS = [
  {
    key:      'free',
    label:    'Free',
    price:    '₹0',
    period:   '/month',
    featured: false,
    features: ['Up to 5 staff', '100 patients/month', 'Basic reports', 'Email support'],
  },
  {
    key:      'pro',
    label:    'Pro',
    price:    '₹2,999',
    period:   '/month',
    featured: true,
    features: ['Unlimited staff', 'Unlimited patients', 'Advanced analytics', 'Priority support', 'Custom branding'],
  },
  {
    key:      'enterprise',
    label:    'Enterprise',
    price:    'Custom',
    period:   '',
    featured: false,
    features: ['Everything in Pro', 'Dedicated server', 'SLA guarantee', '24/7 phone support', 'Custom integrations'],
  },
];

// ── Component ─────────────────────────────────────────────────

const LandingPage = () => {
  const [modalOpen, setModalOpen]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(null); // workspace URL after register
  const [form]                        = Form.useForm();
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginLoading, setLoginLoading]     = useState(false);
  const [loginError, setLoginError]         = useState('');
  const [loginForm]                         = Form.useForm();

  const handleFindWorkspace = async () => {
    try {
      const values = await loginForm.validateFields();
      setLoginLoading(true);
      setLoginError('');

      const subdomain = values.subdomain.trim().toLowerCase();
      const res = await tenantService.checkSubdomain(subdomain);
      const data = res?.payload?.data;

      if (data && data.available === false) {
        window.location.href = `http://${subdomain}.localhost:3000/login`;
      } else {
        setLoginError('Workspace subdomain not found.');
      }
    } catch (err) {
      if (err?.errorFields) return;
      setLoginError('An error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const openRegister = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
    form.resetFields();
  };

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        ...values,
        plan_type: selectedPlan.key,
        theme:     values.theme || 'dark',
      };

      const res    = await tenantService.registerTenant(payload);
      const data   = res?.payload?.data;

      if (!data?.workspace) throw new Error('Registration failed');

      setSuccess(data);
      setModalOpen(false);
      antMsg.success('Workspace created!');

    } catch (err) {
      if (err?.errorFields) return; // Ant Design validation
      antMsg.error(err?.response?.data?.payload?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <PageWrapper>
      <Container>

        {/* Hero */}
        <HeroSection>
          <Box sx={{ mb: 2 }}>
            <Chip
              label="Healthcare SaaS Platform"
              sx={{ background: 'rgba(79,142,247,0.15)', color: '#4f8ef7', fontWeight: 600 }}
            />
          </Box>
          <HeroTitle>Manage Your Hospital Smarter</HeroTitle>
          <HeroSubtitle>
            All-in-one platform for appointments, patients, billing, and staff — built for modern healthcare teams.
          </HeroSubtitle>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #4f8ef7, #7c5cbf)',
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '16px',
              }}
              onClick={() => openRegister(PLANS[1])}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: '#2a2d3e', color: '#9094a6', borderRadius: '12px', px: 4 }}
              onClick={() => {
                setLoginModalOpen(true);
                loginForm.resetFields();
                setLoginError('');
              }}
            >
              Sign In
            </Button>
          </Box>
        </HeroSection>

        {/* Workspace Success Banner */}
        {success && (
          <Segment
            style={{
              background: 'rgba(46,204,113,0.1)',
              border: '1px solid #2ecc71',
              borderRadius: '12px',
              marginBottom: '40px',
              padding: '24px',
            }}
          >
            <SHeader as="h3" style={{ color: '#2ecc71', marginBottom: '8px' }}>
              🎉 Your workspace is ready!
            </SHeader>
            <Typography style={{ color: '#9094a6', marginBottom: '16px' }}>
              Visit your workspace to log in with your admin credentials:
            </Typography>
            <Box
              sx={{
                background: '#1a1d27',
                borderRadius: '8px',
                padding: '12px 20px',
                fontFamily: 'monospace',
                fontSize: '16px',
                color: '#4f8ef7',
                display: 'inline-block',
                marginBottom: '16px',
              }}
            >
              http://{success.workspace}
            </Box>
            <br />
            <Button
              variant="contained"
              sx={{ background: '#2ecc71', color: '#fff', borderRadius: '8px' }}
              onClick={() => window.location.href = `http://${success.workspace}/login`}
            >
              Go to My Workspace →
            </Button>
          </Segment>
        )}

        {/* Pricing Plans */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: '#e8eaf6', fontWeight: 700, mb: 1 }}
          >
            Choose Your Plan
          </Typography>
          <Typography
            align="center"
            sx={{ color: '#9094a6', mb: 4 }}
          >
            Start free, scale as you grow
          </Typography>

          <Grid columns={3} stackable>
            <Grid.Row>
              {PLANS.map((plan) => (
                <Grid.Column key={plan.key}>
                  <PlanCard $featured={plan.featured}>
                    <CardContent sx={{ p: 4 }}>
                      {plan.featured && (
                        <Chip
                          label="Most Popular"
                          size="small"
                          sx={{ mb: 2, background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                        />
                      )}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: plan.featured ? '#fff' : '#e8eaf6',
                          mb: 1,
                        }}
                      >
                        {plan.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, color: plan.featured ? '#fff' : '#4f8ef7' }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography
                          sx={{ color: plan.featured ? 'rgba(255,255,255,0.7)' : '#9094a6', ml: 1 }}
                        >
                          {plan.period}
                        </Typography>
                      </Box>

                      <List
                        items={plan.features.map((f) => ({
                          key: f,
                          content: f,
                          icon: { name: 'check circle', style: { color: plan.featured ? '#ffffff' : '#2185d0' } },
                        }))}
                        style={{ color: plan.featured ? 'rgba(255,255,255,0.9)' : '#9094a6', marginBottom: '24px' }}
                      />

                      <Button
                        fullWidth
                        variant={plan.featured ? 'outlined' : 'contained'}
                        sx={{
                          borderRadius: '10px',
                          py: 1.5,
                          fontWeight: 600,
                          border: plan.featured ? '2px solid rgba(255,255,255,0.6)' : 'none',
                          color: plan.featured ? '#fff' : undefined,
                          background: plan.featured
                            ? 'transparent'
                            : 'linear-gradient(135deg, #4f8ef7, #7c5cbf)',
                          '&:hover': {
                            background: plan.featured
                              ? 'rgba(255,255,255,0.15)'
                              : 'linear-gradient(135deg, #3a7ae0, #6a4daa)',
                          },
                        }}
                        onClick={() => openRegister(plan)}
                      >
                        {plan.key === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </PlanCard>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        </Box>

      </Container>

      {/* Registration Modal */}
      <Modal
        title={
          <span style={{ color: '#1a1d27', fontSize: '20px', fontWeight: 700 }}>
            Register Your Hospital — {selectedPlan?.label} Plan
          </span>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        closeIcon={<Icon name="close" style={{ color: '#6a6d7c', fontSize: '14px' }} />}
        footer={[
          <Button key="cancel" variant="outlined" onClick={() => setModalOpen(false)} sx={cancelBtnSx}>
            Cancel
          </Button>,
          <Button key="submit" variant="contained" disabled={loading} onClick={handleRegister} sx={submitBtnSx}>
            {loading ? 'Creating Workspace...' : 'Create Workspace'}
          </Button>
        ]}
        styles={modalStyles}
        width={520}
      >
        <ModalForm>
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: '16px' }}
          >
            <Form.Item
              name="company_name"
              initialValue=""
              rules={[{ required: true, message: 'Please enter your hospital name' }]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Hospital / Clinic Name"
                placeholder="e.g. Apollo Hospitals"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="hospital" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="admin_name"
              initialValue=""
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Your Full Name (Admin)"
                placeholder="e.g. Dr. John Smith"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="user" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="admin_email"
              initialValue=""
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Admin Email (Gmail)"
                placeholder="admin@hospital.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="mail" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="theme"
              initialValue="dark"
            >
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Preferred Theme"
                slotProps={{
                  select: {
                    MenuProps: {
                      disablePortal: true,
                    }
                  }
                }}
              >
                <MenuItem value="dark">🌙 Dark</MenuItem>
                <MenuItem value="light">☀️ Light</MenuItem>
                <MenuItem value="warm">🌅 Warm</MenuItem>
              </TextField>
            </Form.Item>

            <Form.Item
              name="password"
              initialValue=""
              rules={[
                { required: true, message: 'Please enter a password' },
                { min: 8, message: 'At least 8 characters' },
              ]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                placeholder="Min. 8 characters"
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="lock" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#9094a6' }}
                        >
                          <Icon name={showPassword ? 'eye' : 'eye slash'} style={{ fontSize: '16px', margin: 0 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              initialValue=""
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <TextField
                fullWidth
                variant="outlined"
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
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#9094a6' }}
                        >
                          <Icon name={showConfirmPassword ? 'eye' : 'eye slash'} style={{ fontSize: '16px', margin: 0 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>
          </Form>
        </ModalForm>
      </Modal>

      {/* Sign In Workspace Modal */}
      <Modal
        title={
          <span style={{ color: '#1a1d27', fontSize: '20px', fontWeight: 700 }}>
            Sign In to Your Workspace
          </span>
        }
        open={loginModalOpen}
        onCancel={() => setLoginModalOpen(false)}
        closeIcon={<Icon name="close" style={{ color: '#6a6d7c', fontSize: '14px' }} />}
        footer={[
          <Button key="cancel" variant="outlined" onClick={() => setLoginModalOpen(false)} sx={cancelBtnSx}>
            Cancel
          </Button>,
          <Button key="submit" variant="contained" disabled={loginLoading} onClick={handleFindWorkspace} sx={submitBtnSx}>
            {loginLoading ? 'Finding Workspace...' : 'Continue'}
          </Button>
        ]}
        styles={modalStyles}
        width={450}
      >
        <ModalForm>
          <Form
            form={loginForm}
            layout="vertical"
            style={{ marginTop: '16px' }}
          >
            {loginError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: '8px',
                  background: 'rgba(211,47,47,0.1)',
                  border: '1px solid #d32f2f',
                  color: '#ff5252',
                  '.MuiAlert-icon': { color: '#ff5252' },
                }}
              >
                {loginError}
              </Alert>
            )}

            <Form.Item
              name="subdomain"
              initialValue=""
              rules={[{ required: true, message: 'Please enter your workspace subdomain' }]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Workspace Subdomain"
                placeholder="apolloclinic"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="world" style={{ fontSize: '16px', margin: '0 8px 0 0' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <span style={{ color: '#5a5d6e', fontSize: '13px', whiteSpace: 'nowrap' }}>
                          .localhost:3000
                        </span>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>
          </Form>
        </ModalForm>
      </Modal>
    </PageWrapper>
  );
};

export default LandingPage;