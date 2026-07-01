import { useState } from 'react';
import { Grid, Container, Header as SHeader, Segment, List } from 'semantic-ui-react';
import { CardContent, Typography, Box, Chip } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { StyledButton } from '../../components/common';
import RegisterWorkspaceModal from '../../components/tenant/RegisterWorkspaceModal';
import SignInWorkspaceModal from '../../components/tenant/SignInWorkspaceModal';
import {
  PageWrapper,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  PlanCard,
} from '../../components/styled/LandingPage.styles';

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
  const { theme } = useTheme();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan]           = useState(null);
  const [signInModalOpen, setSignInModalOpen]     = useState(false);
  const [success, setSuccess]                     = useState(null); // workspace URL after register

  const openRegister = (plan) => {
    setSelectedPlan(plan);
    setRegisterModalOpen(true);
  };

  const handleRegisterSuccess = (data) => {
    setSuccess(data);
    setRegisterModalOpen(false);
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
            <StyledButton
              variant="contained"
              size="large"
              sx={{ borderRadius: '12px', px: 4, py: 1.5, fontSize: '16px' }}
              onClick={() => openRegister(PLANS[1])}
            >
              Get Started Free
            </StyledButton>
            <StyledButton
              variant="outlined"
              size="large"
              sx={{ borderRadius: '12px', px: 4 }}
              onClick={() => setSignInModalOpen(true)}
            >
              Sign In
            </StyledButton>
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
                background: '#ffffffff',
                borderRadius: '8px',
                padding: '12px 20px',
                fontFamily: 'monospace',
                fontSize: '16px',
                color: '#9094a6',
                display: 'inline-block',
                marginBottom: '16px',
              }}
            >
              http://{success.workspace}
            </Box>
            <br />
            <StyledButton
              variant="contained"
              sx={{ background: '#2ecc71', color: '#fff', borderRadius: '8px' }}
              onClick={() => (window.location.href = `http://${success.workspace}/login`)}
            >
              Go to My Workspace →
            </StyledButton>
          </Segment>
        )}

        {/* Pricing Plans */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: theme.colors?.textPrimary || '#1a202c', fontWeight: 700, mb: 1 }}
          >
            Choose Your Plan
          </Typography>
          <Typography
            align="center"
            sx={{ color: theme.colors?.textSecondary || '#4a5568', mb: 4 }}
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
                          color: plan.featured ? '#fff' : (theme.colors?.textPrimary || '#1a202c'),
                          mb: 1,
                        }}
                      >
                        {plan.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, color: plan.featured ? '#fff' : (theme.colors?.primary || '#7c5cbf') }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography
                          sx={{ color: plan.featured ? 'rgba(255,255,255,0.7)' : (theme.colors?.textSecondary || '#4a5568'), ml: 1 }}
                        >
                          {plan.period}
                        </Typography>
                      </Box>

                      <List
                        items={plan.features.map((f) => ({
                          key: f,
                          content: f,
                          icon: { name: 'check circle', style: { color: plan.featured ? '#ffffff' : (theme.colors?.primary || '#7c5cbf') } },
                        }))}
                        style={{ color: plan.featured ? 'rgba(255,255,255,0.9)' : (theme.colors?.textSecondary || '#4a5568'), marginBottom: '24px' }}
                      />

                      <StyledButton
                        fullWidth
                        variant="contained"
                        sx={{
                          borderRadius: '10px',
                          py: 1.5,
                          background: plan.featured ? '#ffffff !important' : undefined,
                          color: plan.featured ? (theme.colors?.primary || '#7c5cbf') + ' !important' : undefined,
                          border: plan.featured ? 'none !important' : undefined,
                          boxShadow: plan.featured ? '0 4px 10px rgba(0,0,0,0.1) !important' : undefined,
                          '&:hover': {
                            background: plan.featured ? '#f4f4f5 !important' : undefined,
                            boxShadow: plan.featured ? '0 6px 15px rgba(0,0,0,0.15) !important' : undefined,
                          },
                        }}
                        onClick={() => openRegister(plan)}
                      >
                        {plan.key === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                      </StyledButton>
                    </CardContent>
                  </PlanCard>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        </Box>

      </Container>

      <RegisterWorkspaceModal
        open={registerModalOpen}
        plan={selectedPlan}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />

      <SignInWorkspaceModal
        open={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </PageWrapper>
  );
};

export default LandingPage;