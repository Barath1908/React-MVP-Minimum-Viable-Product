import { useEffect, useState } from "react";
import dashboardAPI from "../../modules/dashboard/dashboardAPI";
import { StyledCard } from "../../components/common";
import {
  Grid,
  CardTitle,
  Count,
} from "../../components/styled/DashboardPage.styles";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  );
};

export default DashboardPage;