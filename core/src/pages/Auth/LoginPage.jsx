import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { InputAdornment, IconButton, Box } from "@mui/material";
import { Form } from "antd";
import useAuth from "../../modules/auth/hooks/useAuth";
import { ROUTES, ROLES } from "../../utils/constants";
import {
  StyledButton,
  StyledTextField,
  StyledAlert,
} from "../../components/common";
import {
  PageWrapper,
  BrandPanel,
  DecorativeCircle,
  FormPanel,
  FormCard,
  LogoRow,
  HeroText,
  HeroTitle,
  HeroSubtitle,
  FeatureList,
  FeatureItem,
  FooterNote,
  FormHeader,
  FormTitle,
  FormSubtitle,
  FormWrapper,
  BackLink,
} from "../../components/styled/LoginPage.styles";

// ── Component ─────────────────────────────────────────────────

const LoginPage = () => {
  const { login, loading, error, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const tenantConfig = useSelector((state) => state.tenant?.tenant);
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === ROLES.PHARMACIST) {
        navigate(ROUTES.PRESCRIPTIONS, { replace: true });
      } else if (role === ROLES.RECEPTIONIST || role === ROLES.PATIENT) {
        navigate(ROUTES.APPOINTMENTS, { replace: true });
      } else {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = (values) => {
    login({
      email: values.email,
      password: values.password,
    });
  };

  const handleBackToLanding = () => {
    const { protocol, hostname, port } = window.location;
    const parts = hostname.split(".");

    if (parts.length > 1) {
      const baseHost = parts.slice(1).join(".");
      const portStr = port ? `:${port}` : "";
      window.location.href = `${protocol}//${baseHost}${portStr}`;
    } else {
      window.location.href = "/";
    }
  };

  return (
    <PageWrapper>
      {/* ---------- Left brand panel ---------- */}
      <BrandPanel>
        <DecorativeCircle style={{ width: 220, height: 220, top: -80, right: -60 }} />
        <DecorativeCircle style={{ width: 140, height: 140, bottom: 40, left: -50 }} />

        <LogoRow>
          <Icon name="hospital" />
          <span>{tenantConfig?.company_name || "Healthcare SaaS"}</span>
        </LogoRow>

        <HeroText>
          <HeroTitle>
            Welcome back to your care workspace
          </HeroTitle>
          <HeroSubtitle>
            Sign in to manage patients, appointments, prescriptions, and
            billing — all from one secure dashboard built for your team.
          </HeroSubtitle>

          <FeatureList>
            <FeatureItem>
              <Icon name="shield alternate" />
              <span>Bank-grade security &amp; encrypted sessions</span>
            </FeatureItem>
            <FeatureItem>
              <Icon name="clock outline" />
              <span>Real-time appointment &amp; staff scheduling</span>
            </FeatureItem>
            <FeatureItem>
              <Icon name="chart line" />
              <span>Built-in analytics for every department</span>
            </FeatureItem>
          </FeatureList>
        </HeroText>

        <FooterNote>
          © {new Date().getFullYear()} {tenantConfig?.company_name || "Healthcare SaaS"}. All rights reserved.
        </FooterNote>
      </BrandPanel>

      {/* ---------- Right form panel ---------- */}
      <FormPanel>
        <FormCard>
          <FormHeader>
            <FormTitle>Sign In</FormTitle>
            <FormSubtitle>Enter your credentials to access your workspace</FormSubtitle>
          </FormHeader>

          {error && <StyledAlert severity="error">{error}</StyledAlert>}

          <FormWrapper>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="email"
                initialValue=""
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <StyledTextField
                  placeholder="admin@hospital.com"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="mail" style={{ fontSize: "16px", margin: "0 8px 0 0" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                initialValue=""
                style={{ marginTop: '34px' }}
                rules={[{ required: true, message: "Password is required" }]}
              >
                <StyledTextField
                  placeholder="Your password"
                  type={showPassword ? "text" : "password"}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="lock" style={{ fontSize: "16px", margin: "0 8px 0 0" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "#9094a6" }}
                          >
                            <Icon
                              name={showPassword ? "eye" : "eye slash"}
                              style={{ fontSize: "16px", margin: 0 }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Form.Item>

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ height: "46px", fontSize: "15px", mt: 1 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </StyledButton>
            </Form>
          </FormWrapper>

          <Box sx={{ textAlign: "center" }}>
            <BackLink onClick={handleBackToLanding}>
              <Icon name="arrow left" />
              Back to Homepage
            </BackLink>
          </Box>
        </FormCard>
      </FormPanel>
    </PageWrapper>
  );
};

export default LoginPage;