import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Grid, Container, Icon } from "semantic-ui-react";
import { Card, CardContent, Typography, Box, Alert, Button, TextField, MenuItem, InputAdornment, IconButton } from "@mui/material";
import { Form } from "antd";
import authAPI from "../../modules/auth/authAPI";
import useAuth from "../../modules/auth/hooks/useAuth";
import { ROUTES, ROLES } from "../../utils/constants";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.backgroundCard} !important;
  border: 1px solid ${({ theme }) => theme.colors.border} !important;
  border-radius: 16px !important;
  width: 100%;
  max-width: 460px;
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
      // Register — no tenant_id needed
      await authAPI.register({
        role_id:    values.role_id,
        first_name: values.first_name,
        last_name:  values.last_name,
        email:      values.email,
        password:   values.password,
      });

      // Auto login after register
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
              <Typography
                variant="h5"
                sx={{ color: '#e8eaf6', fontWeight: 700, mb: 0.5 }}
              >
                Create Account
              </Typography>
              <Typography sx={{ color: '#9094a6', fontSize: '14px' }}>
                Register as a new staff member
              </Typography>
            </Box>

            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                    {error}
                  </Alert>
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
                      rules={[{ required: true, message: 'Please select a role' }]}
                    >
                      <TextField
                        select
                        fullWidth
                        variant="outlined"
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
                      </TextField>
                    </Form.Item>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Form.Item
                        name="first_name"
                        initialValue=""
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="First Name"
                          placeholder="John"
                        />
                      </Form.Item>

                      <Form.Item
                        name="last_name"
                        initialValue=""
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Last Name"
                          placeholder="Smith"
                        />
                      </Form.Item>
                    </Box>

                    <Form.Item
                      name="email"
                      initialValue=""
                      rules={[
                        { required: true, message: 'Email is required' },
                        { type: 'email',  message: 'Enter a valid email' },
                      ]}
                    >
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        placeholder="john@hospital.com"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      initialValue=""
                      rules={[
                        { required: true, message: 'Password is required' },
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
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                          height: '44px',
                          background: 'linear-gradient(135deg, #4f8ef7, #7c5cbf)',
                          color: '#fff',
                          borderRadius: '10px',
                          fontSize: '15px',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #3a7ae0, #6a4daa)',
                          },
                        }}
                      >
                        {loading ? 'Creating Account...' : 'Register'}
                      </Button>
                    </Form.Item>
                  </Form>
                </FormWrapper>

                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography sx={{ color: '#9094a6', fontSize: '14px' }}>
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} style={{ color: '#4f8ef7' }}>
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid.Column>
        </Grid>
      </Container>
    </PageWrapper>
  );
};

export default RegisterPage;