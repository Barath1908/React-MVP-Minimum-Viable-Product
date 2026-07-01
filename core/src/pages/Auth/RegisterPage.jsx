import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Grid, Container, Icon } from "semantic-ui-react";
import { Typography, Box, MenuItem, InputAdornment, IconButton } from "@mui/material";
import { Form } from "antd";
import authAPI from "../../modules/auth/authAPI";
import useAuth from "../../modules/auth/hooks/useAuth";
import { ROUTES, ROLES } from "../../utils/constants";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledAlert,
} from "../../components/common";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const FormWrapper = styled.div`
  .ant-form-item {
    margin-bottom: 20px !important;
  }
  .ant-form-item-explain-error {
    color: ${({ theme }) => theme.colors.danger || '#ff4d4f'} !important;
    font-size: 13px !important;
    margin-top: 4px !important;
  }
`;

const TitleText = styled(Typography)`
  && {
    color: ${(props) => props.theme.colors?.textPrimary || '#ffffff'};
    font-weight: 700;
    margin-bottom: 4px;
  }
`;

const SubtitleText = styled(Typography)`
  && {
    color: ${(props) => props.theme.colors?.textSecondary || '#9094a6'};
    font-size: 14px;
  }
`;

const RegisterPage = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [form]                = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === ROLES.RECEPTIONIST) {
        navigate(ROUTES.CALENDAR,   { replace: true });
      } else {
        navigate(ROUTES.DASHBOARD,  { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (values) => {
    setError('');
    setLoading(true);

    try {
      await authAPI.register({
        role_id:    values.role_id,
        first_name: values.first_name,
        last_name:  values.last_name,
        email:      values.email,
        password:   values.password,
      });

      login({
        email:    values.email,
        password: values.password,
      });

    } catch (err) {
      setError(
        err.response?.data?.payload?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Grid centered>
          <Grid.Column mobile={16} tablet={10} computer={7}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <TitleText variant="h5">
                Create Account
              </TitleText>
              <SubtitleText>
                Register as a new staff member
              </SubtitleText>
            </Box>

            <StyledCard sx={{ width: '100%', maxWidth: '460px', margin: '0 auto', '& .MuiCardContent-root': { p: 4 } }}>
              {error && (
                <StyledAlert severity="error">
                  {error}
                </StyledAlert>
              )}

              <FormWrapper>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                >
                  <Form.Item
                    name="role_id"
                    initialValue=""
                    style={{ marginBottom: '20px' }}
                    rules={[{ required: true, message: 'Please select a role' }]}
                  >
                    <StyledTextField
                      select
                      label="Role"
                      defaultValue=""
                      slotProps={{
                        select: {
                          MenuProps: {
                            disablePortal: true,
                          }
                        }
                      }}
                    >
                      <MenuItem value={2}>Provider (Doctor)</MenuItem>
                      <MenuItem value={3}>Nurse</MenuItem>
                      <MenuItem value={4}>Patient</MenuItem>
                      <MenuItem value={5}>Pharmacist</MenuItem>
                      <MenuItem value={6}>Receptionist</MenuItem>
                    </StyledTextField>
                  </Form.Item>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Form.Item
                      name="first_name"
                      initialValue=""
                      style={{ flex: 1, marginBottom: '20px' }}
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <StyledTextField
                        label="First Name"
                        placeholder="John"
                      />
                    </Form.Item>

                    <Form.Item
                      name="last_name"
                      initialValue=""
                      style={{ flex: 1, marginBottom: '20px' }}
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <StyledTextField
                        label="Last Name"
                        placeholder="Smith"
                      />
                    </Form.Item>
                  </Box>

                  <Form.Item
                    name="email"
                    initialValue=""
                    style={{ marginBottom: '20px' }}
                    rules={[
                      { required: true, message: 'Email is required' },
                      { type: 'email',  message: 'Enter a valid email' },
                    ]}
                  >
                    <StyledTextField
                      label="Email"
                      placeholder="john@hospital.com"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    initialValue=""
                    style={{ marginBottom: '20px' }}
                    rules={[
                      { required: true, message: 'Password is required' },
                      { min: 8, message: 'At least 8 characters' },
                    ]}
                  >
                    <StyledTextField
                      label="Password"
                      placeholder="Min. 8 characters"
                      type={showPassword ? 'text' : 'password'}
                      slotProps={{
                        input: {
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
                          ),
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: '8px' }}>
                    <StyledButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{ height: '44px', fontSize: '15px' }}
                    >
                      {loading ? 'Creating Account...' : 'Register'}
                    </StyledButton>
                  </Form.Item>
                </Form>
              </FormWrapper>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography sx={{ color: '#9094a6', fontSize: '14px' }}>
                  Already have an account?{' '}
                  <Link to={ROUTES.LOGIN} style={{ color: '#7c5cbf', fontWeight: 600 }}>
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </StyledCard>
          </Grid.Column>
        </Grid>
      </Container>
    </PageWrapper>
  );
};

export default RegisterPage;