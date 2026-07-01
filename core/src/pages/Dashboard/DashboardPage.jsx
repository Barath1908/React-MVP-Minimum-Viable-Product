import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, message as antMsg } from "antd";
import { MenuItem, InputAdornment, IconButton, Box } from "@mui/material";
import { Icon } from "semantic-ui-react";
import dashboardAPI from "../../modules/dashboard/dashboardAPI";
import useAuth from "../../modules/auth/hooks/useAuth";
import authAPI from "../../modules/auth/authAPI";
import { ROLES } from "../../utils/constants";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledModal,
  StyledAlert,
} from "../../components/common";
import { useTheme } from "../../context/ThemeContext";
import tenantService from "../../services/tenantService";
import {
  DashboardLayout,
  Sidebar,
  LogoArea,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  LogoutLink,
  MainWorkspace,
  TopBar,
  Title,
  UserSection,
  ContentArea,
  Grid,
  CardTitle,
  Count,
  ThemeSelectField,
} from "../../components/styled/DashboardPage.styles";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { themeName, changeTheme } = useTheme();
  const tenantConfig = useSelector((state) => state.tenant?.tenant);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeChanging, setThemeChanging] = useState(false);

  const handleThemeChange = async (e) => {
    const selectedTheme = e.target.value;
    try {
      setThemeChanging(true);
      await tenantService.updateTenantTheme(selectedTheme);
      changeTheme(selectedTheme);
      antMsg.success("Workspace theme updated successfully!");
    } catch (err) {
      antMsg.error(
        err?.response?.data?.payload?.message || err?.message || "Failed to update theme."
      );
    } finally {
      setThemeChanging(false);
    }
  };

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
      fetchDashboard();
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
    <DashboardLayout>
      <Sidebar>
        <div>
          <LogoArea>
            <Icon name="hospital" style={{ fontSize: '24px' }} />
            <span>{tenantConfig?.company_name || 'Apollo Clinic'}</span>
          </LogoArea>
          <SidebarMenu>
            <SidebarMenuItem $active={true}>
              <Icon name="dashboard" style={{ fontSize: '16px' }} />
              <span>Dashboard</span>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Icon name="users" style={{ fontSize: '16px' }} />
              <span>Patients</span>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Icon name="calendar" style={{ fontSize: '16px' }} />
              <span>Appointments</span>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Icon name="credit card" style={{ fontSize: '16px' }} />
              <span>Billing</span>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Icon name="setting" style={{ fontSize: '16px' }} />
              <span>Settings</span>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        <SidebarFooter>
          <LogoutLink onClick={logout}>
            <Icon name="log out" style={{ fontSize: '16px' }} />
            <span>Logout</span>
          </LogoutLink>
        </SidebarFooter>
      </Sidebar>

      <MainWorkspace>
        <TopBar>
          <Title>Healthcare Dashboard</Title>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user?.role === ROLES.ADMIN && (
              <>
                <Box sx={{ minWidth: 120, mr: 2 }}>
                  <ThemeSelectField
                    select
                    value={themeName}
                    onChange={handleThemeChange}
                    disabled={themeChanging}
                    slotProps={{
                      select: {
                        MenuProps: {
                          disablePortal: true,
                        }
                      }
                    }}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="warm">Warm</MenuItem>
                  </ThemeSelectField>
                </Box>
                <StyledButton
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    setRegisterModalOpen(true);
                    form.resetFields();
                    setRegisterError("");
                  }}
                >
                  Register New User
                </StyledButton>
              </>
            )}
            <StyledButton
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => {
                setChangePasswordModalOpen(true);
                changePasswordForm.resetFields();
                setChangePasswordError("");
              }}
            >
              Change Password
            </StyledButton>
            <UserSection>
              <Icon name="user circle" style={{ fontSize: '24px', color: '#9094a6' }} />
              <span>{user?.fullName || "User"}</span>
            </UserSection>
          </div>
        </TopBar>

        <ContentArea>
          <Grid>
            <StyledCard>
              <CardTitle>Total Patients</CardTitle>
              <Count>{summary?.patients?.total ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Total Appointments</CardTitle>
              <Count>{summary?.appointments?.total ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Pending Appointments</CardTitle>
              <Count>{summary?.appointments?.pending ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Confirmed Appointments</CardTitle>
              <Count>{summary?.appointments?.confirmed ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Completed Appointments</CardTitle>
              <Count>{summary?.appointments?.completed ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Cancelled Appointments</CardTitle>
              <Count>{summary?.appointments?.cancelled ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Total Prescriptions</CardTitle>
              <Count>{summary?.prescriptions?.total ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Issued Prescriptions</CardTitle>
              <Count>{summary?.prescriptions?.issued ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Verified Prescriptions</CardTitle>
              <Count>{summary?.prescriptions?.verified ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Dispensed Prescriptions</CardTitle>
              <Count>{summary?.prescriptions?.dispensed ?? 0}</Count>
            </StyledCard>

            <StyledCard>
              <CardTitle>Cancelled Prescriptions</CardTitle>
              <Count>{summary?.prescriptions?.cancelled ?? 0}</Count>
            </StyledCard>
          </Grid>
        </ContentArea>
      </MainWorkspace>

      {/* Admin User Registration Modal */}
      <StyledModal
        title="Register New User"
        open={registerModalOpen}
        onCancel={() => setRegisterModalOpen(false)}
        footer={[
          <StyledButton key="cancel" variant="outlined" onClick={() => setRegisterModalOpen(false)} sx={{ mr: 1 }}>
            Cancel
          </StyledButton>,
          <StyledButton key="submit" variant="contained" disabled={registerLoading} onClick={handleRegisterUser}>
            {registerLoading ? 'Registering...' : 'Register User'}
          </StyledButton>
        ]}
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '16px' }}
        >
          {registerError && (
            <StyledAlert severity="error">
              {registerError}
            </StyledAlert>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Form.Item
              name="first_name"
              initialValue=""
              style={{ flex: 1, marginBottom: '20px' }}
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <StyledTextField
                label="First Name"
                placeholder="e.g. John"
              />
            </Form.Item>

            <Form.Item
              name="last_name"
              initialValue=""
              style={{ flex: 1, marginBottom: '20px' }}
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <StyledTextField
                label="Last Name"
                placeholder="e.g. Smith"
              />
            </Form.Item>
          </Box>

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
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Provider (Doctor)</MenuItem>
              <MenuItem value={3}>Nurse</MenuItem>
              <MenuItem value={4}>Patient</MenuItem>
              <MenuItem value={5}>Pharmacist</MenuItem>
              <MenuItem value={6}>Receptionist</MenuItem>
            </StyledTextField>
          </Form.Item>

          <Form.Item
            name="email"
            initialValue=""
            style={{ marginBottom: '20px' }}
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <StyledTextField
              label="Email"
              placeholder="user@hospital.com"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            initialValue=""
            style={{ marginBottom: '20px' }}
          >
            <StyledTextField
              label="Phone Number (Optional)"
              placeholder="e.g. +91 98765 43210"
            />
          </Form.Item>

          <Form.Item
            name="password"
            initialValue=""
            style={{ marginBottom: '20px' }}
            rules={[
              { required: true, message: 'Please enter a password' },
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
                  )
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            initialValue=""
            dependencies={['password']}
            style={{ marginBottom: '20px' }}
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
            <StyledTextField
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
      </StyledModal>

      {/* Change Password Modal */}
      <StyledModal
        title="Change Password"
        open={changePasswordModalOpen}
        onCancel={() => setChangePasswordModalOpen(false)}
        footer={[
          <StyledButton key="cancel" variant="outlined" onClick={() => setChangePasswordModalOpen(false)} sx={{ mr: 1 }}>
            Cancel
          </StyledButton>,
          <StyledButton key="submit" variant="contained" disabled={changePasswordLoading} onClick={handleChangePassword}>
            {changePasswordLoading ? 'Updating...' : 'Update Password'}
          </StyledButton>
        ]}
        width={420}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          style={{ marginTop: '16px' }}
        >
          {changePasswordError && (
            <StyledAlert severity="error">
              {changePasswordError}
            </StyledAlert>
          )}

          <Form.Item
            name="current_password"
            initialValue=""
            style={{ marginBottom: '20px' }}
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <StyledTextField
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
            style={{ marginBottom: '20px' }}
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'At least 8 characters' },
            ]}
          >
            <StyledTextField
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
            style={{ marginBottom: '20px' }}
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
            <StyledTextField
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
      </StyledModal>
    </DashboardLayout>
  );
};

export default DashboardPage;