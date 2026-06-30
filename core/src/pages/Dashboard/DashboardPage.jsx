import { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Form, message as antMsg } from "antd";
import { Button, TextField, MenuItem, InputAdornment, IconButton, Alert, Box } from "@mui/material";
import { Icon } from "semantic-ui-react";
import dashboardAPI from "../../modules/dashboard/dashboardAPI";
import useAuth from "../../modules/auth/hooks/useAuth";
import authAPI from "../../modules/auth/authAPI";
import { ROLES } from "../../utils/constants";

const Container = styled.div`
  padding: 30px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h1`
  margin: 0;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #c53030;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: ${(props) => props.theme.cardBg || "#fff"};
  color: ${(props) => props.theme.text || "#000"};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin-bottom: 10px;
`;

const Count = styled.p`
  font-size: 28px;
  font-weight: bold;
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
  borderColor: '#e0e0e0',
  color: '#9094a6',
  borderRadius: '8px',
  mr: 1,
  height: '40px',
  px: 3,
  textTransform: 'none',
  '&:hover': { borderColor: '#4f8ef7', color: '#4f8ef7', background: 'rgba(79,142,247,0.08)' },
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

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User Registration State
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form] = Form.useForm();

  // Change Password State
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [changePasswordForm] = Form.useForm();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getSummary();
      const data = response?.data?.payload?.data ?? response?.data ?? null;
      setSummary(data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    try {
      const values = await form.validateFields();
      setRegisterLoading(true);
      setRegisterError("");

      await authAPI.register({
        role_id:    values.role_id,
        first_name: values.first_name,
        last_name:  values.last_name,
        email:      values.email,
        phone:      values.phone,
        password:   values.password,
      });

      antMsg.success("User registered successfully!");
      setRegisterModalOpen(false);
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return; // Ant Design form validation
      setRegisterError(
        err?.response?.data?.payload?.message || err?.message || "Registration failed."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await changePasswordForm.validateFields();
      setChangePasswordLoading(true);
      setChangePasswordError("");

      await authAPI.changePassword({
        current_password: values.current_password,
        new_password:     values.new_password,
      });

      antMsg.success("Password changed successfully!");
      setChangePasswordModalOpen(false);
      changePasswordForm.resetFields();
    } catch (err) {
      if (err?.errorFields) return; // Ant Design form validation
      setChangePasswordError(
        err?.response?.data?.payload?.message || err?.message || "Failed to update password."
      );
    } finally {
      setChangePasswordLoading(false);
    }
  };

  if (loading) return <h2>Loading Dashboard...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!summary) return <h2>No data available.</h2>;

  return (
    <Container>
      <TopBar>
        <Title>Healthcare Dashboard</Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user?.role === ROLES.ADMIN && (
            <Button
              variant="contained"
              sx={{
                mr: 3,
                background: 'linear-gradient(135deg, #4f8ef7, #7c5cbf)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '8px',
                height: '38px',
                px: 3,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3a7ae0, #6a4daa)',
                  boxShadow: 'none',
                }
              }}
              onClick={() => {
                setRegisterModalOpen(true);
                form.resetFields();
                setRegisterError("");
              }}
            >
              Register New User
            </Button>
          )}
          <Button
            variant="outlined"
            sx={{
              mr: 2,
              borderColor: '#4f8ef7',
              color: '#4f8ef7',
              fontWeight: 500,
              borderRadius: '8px',
              height: '38px',
              px: 2,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#3a7ae0',
                background: 'rgba(79,142,247,0.08)',
              }
            }}
            onClick={() => {
              setChangePasswordModalOpen(true);
              changePasswordForm.resetFields();
              setChangePasswordError("");
            }}
          >
            Change Password
          </Button>
          <span style={{ marginRight: "16px" }}>
            Welcome, {user?.fullName || "User"}
          </span>
          <LogoutButton onClick={logout}>
            Logout
          </LogoutButton>
        </div>
      </TopBar>

      <Grid>
        <Card>
          <CardTitle>Total Patients</CardTitle>
          <Count>{summary?.patients?.total ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Total Appointments</CardTitle>
          <Count>{summary?.appointments?.total ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Pending Appointments</CardTitle>
          <Count>{summary?.appointments?.pending ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Confirmed Appointments</CardTitle>
          <Count>{summary?.appointments?.confirmed ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Completed Appointments</CardTitle>
          <Count>{summary?.appointments?.completed ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Cancelled Appointments</CardTitle>
          <Count>{summary?.appointments?.cancelled ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Total Prescriptions</CardTitle>
          <Count>{summary?.prescriptions?.total ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Issued Prescriptions</CardTitle>
          <Count>{summary?.prescriptions?.issued ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Verified Prescriptions</CardTitle>
          <Count>{summary?.prescriptions?.verified ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Dispensed Prescriptions</CardTitle>
          <Count>{summary?.prescriptions?.dispensed ?? 0}</Count>
        </Card>

        <Card>
          <CardTitle>Cancelled Prescriptions</CardTitle>
          <Count>{summary?.prescriptions?.cancelled ?? 0}</Count>
        </Card>
      </Grid>

      {/* Admin User Registration Modal */}
      <Modal
        title={
          <span style={{ color: '#1a1d27', fontSize: '20px', fontWeight: 700 }}>
            Register New User
          </span>
        }
        open={registerModalOpen}
        onCancel={() => setRegisterModalOpen(false)}
        closeIcon={<Icon name="close" style={{ color: '#6a6d7c', fontSize: '14px' }} />}
        footer={[
          <Button key="cancel" variant="outlined" onClick={() => setRegisterModalOpen(false)} sx={cancelBtnSx}>
            Cancel
          </Button>,
          <Button key="submit" variant="contained" disabled={registerLoading} onClick={handleRegisterUser} sx={submitBtnSx}>
            {registerLoading ? 'Registering...' : 'Register User'}
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
            {registerError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {registerError}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Form.Item
                name="first_name"
                initialValue=""
                style={{ flex: 1 }}
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First Name"
                  placeholder="e.g. John"
                />
              </Form.Item>

              <Form.Item
                name="last_name"
                initialValue=""
                style={{ flex: 1 }}
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last Name"
                  placeholder="e.g. Smith"
                />
              </Form.Item>
            </Box>

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
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>Provider (Doctor)</MenuItem>
                <MenuItem value={3}>Nurse</MenuItem>
                <MenuItem value={4}>Patient</MenuItem>
                <MenuItem value={5}>Pharmacist</MenuItem>
                <MenuItem value={6}>Receptionist</MenuItem>
              </TextField>
            </Form.Item>

            <Form.Item
              name="email"
              initialValue=""
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                placeholder="user@hospital.com"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              initialValue=""
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Phone Number (Optional)"
                placeholder="e.g. +91 98765 43210"
              />
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
                { required: true, message: 'Please confirm password' },
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

      {/* Change Password Modal */}
      <Modal
        title={
          <span style={{ color: '#1a1d27', fontSize: '20px', fontWeight: 700 }}>
            Change Password
          </span>
        }
        open={changePasswordModalOpen}
        onCancel={() => setChangePasswordModalOpen(false)}
        closeIcon={<Icon name="close" style={{ color: '#6a6d7c', fontSize: '14px' }} />}
        footer={[
          <Button key="cancel" variant="outlined" onClick={() => setChangePasswordModalOpen(false)} sx={cancelBtnSx}>
            Cancel
          </Button>,
          <Button key="submit" variant="contained" disabled={changePasswordLoading} onClick={handleChangePassword} sx={submitBtnSx}>
            {changePasswordLoading ? 'Updating...' : 'Update Password'}
          </Button>
        ]}
        styles={modalStyles}
        width={420}
      >
        <ModalForm>
          <Form
            form={changePasswordForm}
            layout="vertical"
            style={{ marginTop: '16px' }}
          >
            {changePasswordError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {changePasswordError}
              </Alert>
            )}

            <Form.Item
              name="current_password"
              initialValue=""
              rules={[{ required: true, message: 'Please enter current password' }]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Current Password"
                placeholder="Enter current password"
                type={showCurrentPassword ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                          sx={{ color: '#9094a6' }}
                        >
                          <Icon name={showCurrentPassword ? 'eye' : 'eye slash'} style={{ fontSize: '16px', margin: 0 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="new_password"
              initialValue=""
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 8, message: 'At least 8 characters' },
              ]}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="New Password"
                placeholder="Min. 8 characters"
                type={showNewPassword ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          sx={{ color: '#9094a6' }}
                        >
                          <Icon name={showNewPassword ? 'eye' : 'eye slash'} style={{ fontSize: '16px', margin: 0 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirm_new_password"
              initialValue=""
              dependencies={['new_password']}
              rules={[
                { required: true, message: 'Please confirm new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
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
                label="Confirm New Password"
                placeholder="Re-enter new password"
                type={showConfirmNewPassword ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          edge="end"
                          sx={{ color: '#9094a6' }}
                        >
                          <Icon name={showConfirmNewPassword ? 'eye' : 'eye slash'} style={{ fontSize: '16px', margin: 0 }} />
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
    </Container>
  );
};

export default DashboardPage;