import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, message, DatePicker, TimePicker } from "antd";
import { Grid, Header, Icon } from "semantic-ui-react";
import { MenuItem, Box } from "@mui/material";
import useAppointments from "../../modules/appointments/hooks/useAppointments";
import usePatients from "../../modules/patients/hooks/usePatients";
import axiosClient from "../../services/axiosClient";
import useAuth from "../../modules/auth/hooks/useAuth";
import { ROLES } from "../../utils/constants";
import dayjs from "dayjs";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledAlert,
} from "../../components/common";
import styled, { createGlobalStyle } from "styled-components";

const FormContainer = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100%;
`;

const SectionHeader = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 13px;
`;

const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const PageTitle = styled(Header)`
  && {
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }
`;

const AlertWrapper = styled(StyledAlert)`
  && {
    margin-bottom: 20px;
  }
`;

const TightGridRow = styled(Grid.Row)`
  && {
    padding-top: 0 !important;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  && {
    background-color: ${({ theme }) => theme.colors.inputBackground} !important;
    border: 1px solid ${({ theme }) => theme.colors.inputBorder} !important;
    border-radius: 8px !important;
    height: 50px !important;
    width: 100% !important;
    
    .ant-picker-input > input {
      color: ${({ theme }) => theme.colors.textPrimary} !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      
      &::placeholder {
        color: ${({ theme }) => theme.colors.textMuted} !important;
      }
    }
    
    .ant-picker-suffix {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
    }
    
    &:hover, &.ant-picker-focused {
      border-color: ${({ theme }) => theme.colors.primary} !important;
    }
    
    &.ant-picker-focused {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20 !important;
    }
  }
`;

const StyledTimePicker = styled(TimePicker)`
  && {
    background-color: ${({ theme }) => theme.colors.inputBackground} !important;
    border: 1px solid ${({ theme }) => theme.colors.inputBorder} !important;
    border-radius: 8px !important;
    height: 50px !important;
    width: 100% !important;
    
    .ant-picker-input > input {
      color: ${({ theme }) => theme.colors.textPrimary} !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      
      &::placeholder {
        color: ${({ theme }) => theme.colors.textMuted} !important;
      }
    }
    
    .ant-picker-suffix {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
    }
    
    &:hover, &.ant-picker-focused {
      border-color: ${({ theme }) => theme.colors.primary} !important;
    }
    
    &.ant-picker-focused {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20 !important;
    }
  }
`;

const GlobalPickerStyle = createGlobalStyle`
  .ant-picker-dropdown {
    .ant-picker-panel-container {
      background-color: ${({ theme }) => theme.colors.backgroundCard} !important;
      border: 1px solid ${({ theme }) => theme.colors.border} !important;
      border-radius: 8px !important;
      box-shadow: ${({ theme }) => theme.shadows?.md || '0 4px 12px rgba(0,0,0,0.15)'} !important;
    }
    
    .ant-picker-panel {
      background: transparent !important;
      border: none !important;
    }
    
    .ant-picker-header {
      color: ${({ theme }) => theme.colors.textPrimary} !important;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border} !important;
      
      button {
        color: ${({ theme }) => theme.colors.textSecondary} !important;
        background: transparent !important;
        
        &:hover {
          color: ${({ theme }) => theme.colors.primary} !important;
        }
      }
    }
    
    .ant-picker-header-view button {
      color: ${({ theme }) => theme.colors.textPrimary} !important;
      font-weight: 600 !important;
    }
    
    .ant-picker-content th {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
      background: transparent !important;
      border: none !important;
    }
    
    .ant-picker-cell {
      color: ${({ theme }) => theme.colors.textMuted} !important;
    }
    
    .ant-picker-cell-in-view {
      color: ${({ theme }) => theme.colors.textPrimary} !important;
    }
    
    .ant-picker-cell-inner {
      color: inherit !important;
      border-radius: 4px !important;
      
      &:hover {
        background: ${({ theme }) => theme.colors.backgroundHover} !important;
      }
    }
    
    .ant-picker-cell-selected .ant-picker-cell-inner {
      background: ${({ theme }) => theme.colors.primary} !important;
      color: #ffffff !important;
    }
    
    .ant-picker-cell-today .ant-picker-cell-inner::before {
      border: 1px solid ${({ theme }) => theme.colors.primary} !important;
      border-radius: 4px !important;
    }
    
    .ant-picker-today-btn {
      color: ${({ theme }) => theme.colors.primary} !important;
      font-weight: 600 !important;
    }
    
    .ant-picker-time-panel-column > li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
      
      &:hover {
        background: ${({ theme }) => theme.colors.backgroundHover} !important;
      }
    }
    
    .ant-picker-time-panel-column > li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
      background: ${({ theme }) => theme.colors.primary} !important;
      color: #ffffff !important;
    }
    
    .ant-picker-ok button {
      background: ${({ theme }) => theme.colors.primary} !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 4px !important;
      padding: 2px 8px !important;
      font-weight: 500 !important;
      
      &:hover {
        background: ${({ theme }) => theme.colors.primaryHover} !important;
      }
    }
  }
`;

export default function AppointmentForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const {
    appointments,
    currentAppointment,
    loading,
    error: apiError,
    createAppointment,
    updateAppointment,
    fetchAppointmentById,
    fetchAppointments,
  } = useAppointments();

  const { patients, fetchPatients } = usePatients();
  const { user } = useAuth();
  const currentPatientRecord = patients.find((p) => String(p.user_id) === String(user?.id));
  const [doctors, setDoctors] = useState([]);
  const [conflictError, setConflictError] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchPatients();

    const loadDoctors = async () => {
      try {
        const res = await axiosClient.get("/auth/staff");
        const list = res.data?.payload?.data || [];
        const filtered = list.filter((d) => d.role === "provider");
        setDoctors(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    loadDoctors();

    if (isEdit && id) {
      fetchAppointmentById(id);
    }
  }, [isEdit, id, fetchAppointmentById, fetchAppointments, fetchPatients]);

  useEffect(() => {
    if (isEdit && currentAppointment && String(currentAppointment.id) === String(id)) {
      const scheduledDay = dayjs(currentAppointment.scheduled_at);
      form.setFieldsValue({
        patient_id: currentAppointment.patient_id,
        provider_id: currentAppointment.provider_id,
        department: currentAppointment.department || "General Medicine",
        appointment_date: scheduledDay,
        appointment_time: scheduledDay,
        reason: currentAppointment.reason || "",
        priority: currentAppointment.priority || "Medium",
        status: currentAppointment.status || "Scheduled",
        duration_minutes: currentAppointment.duration_minutes || 30,
      });
    }
  }, [isEdit, currentAppointment, id, form]);

  useEffect(() => {
    if (!isEdit && user?.role === ROLES.PATIENT && currentPatientRecord) {
      form.setFieldsValue({
        patient_id: currentPatientRecord.id
      });
    }
  }, [isEdit, user, currentPatientRecord, form]);

  const onFinish = async (values) => {
    setConflictError("");

    // Build scheduled_at timestamp
    const dateStr = values.appointment_date.format("YYYY-MM-DD");
    const timeStr = values.appointment_time.format("HH:mm:ss");
    const scheduledAt = `${dateStr} ${timeStr}`;

    // Conflict detection client-side check
    const conflict = appointments.some((appt) => {
      if (isEdit && String(appt.id) === String(id)) return false;
      
      const apptTime = new Date(appt.scheduled_at).getTime();
      const targetTime = new Date(scheduledAt).getTime();

      return (
        appt.provider_id === values.provider_id &&
        apptTime === targetTime &&
        String(appt.status).toLowerCase() !== "cancelled"
      );
    });

    if (conflict) {
      setConflictError("Double Booking Conflict! This doctor is already scheduled for the exact same slot.");
      return;
    }

    const payload = {
      patient_id: values.patient_id,
      provider_id: values.provider_id,
      department: values.department,
      scheduled_at: scheduledAt,
      reason: values.reason,
      priority: values.priority,
      status: values.status,
      duration_minutes: values.duration_minutes,
    };

    if (isEdit) {
      updateAppointment(
        id,
        payload,
        () => {
          message.success("Appointment rescheduled successfully!");
          navigate("/appointments");
        },
        (err) => {
          setConflictError(err || "Failed to update appointment booking.");
        }
      );
    } else {
      createAppointment(
        payload,
        () => {
          message.success("Appointment booked successfully!");
          navigate("/appointments");
        },
        (err) => {
          setConflictError(err || "Failed to create appointment booking.");
        }
      );
    }
  };

  return (
    <FormContainer>
      <GlobalPickerStyle />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <PageHeaderContainer>
              <StyledButton
                variant="outlined"
                onClick={() => navigate("/appointments")}
                sx={{ mr: 2 }}
              >
                <Icon name="arrow left" style={{ margin: 0 }} />
              </StyledButton>
              <PageTitle as="h2">
                {isEdit ? "Reschedule Appointment Slot" : "Schedule New Appointment"}
              </PageTitle>
            </PageHeaderContainer>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <StyledCard>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  patient_id: "",
                  provider_id: "",
                  priority: "Medium",
                  status: "Scheduled",
                  department: "General Medicine",
                  duration_minutes: 30,
                  reason: "",
                }}
              >
                {(conflictError || apiError) && (
                  <AlertWrapper severity="error">
                    {conflictError || apiError}
                  </AlertWrapper>
                )}

                <SectionHeader>Encounter Information</SectionHeader>
                 <Grid columns={2} stackable>
                   <Grid.Row>
                      <Grid.Column>
                        {user?.role === ROLES.PATIENT ? (
                          <>
                            <Form.Item name="patient_id" noStyle>
                              <input type="hidden" />
                            </Form.Item>
                            <StyledTextField 
                              label="Patient" 
                              disabled 
                              value={currentPatientRecord ? `${currentPatientRecord.first_name} ${currentPatientRecord.last_name}` : "Loading..."} 
                            />
                          </>
                        ) : (
                          <Form.Item
                            name="patient_id"
                            rules={[{ required: true, message: "Please select a patient" }]}
                          >
                            <StyledTextField select label="Patient">
                              <MenuItem value="">Select Patient</MenuItem>
                              {patients.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                  {p.first_name} {p.last_name} (ID: #{p.id})
                                </MenuItem>
                              ))}
                            </StyledTextField>
                          </Form.Item>
                        )}
                      </Grid.Column>
                     <Grid.Column>
                       <Form.Item
                         name="provider_id"
                         rules={[{ required: true, message: "Please select a provider" }]}
                       >
                         <StyledTextField select label="Doctor">
                           <MenuItem value="">Select Doctor</MenuItem>
                            {doctors.map((d) => (
                              <MenuItem key={d.id} value={d.id}>
                                Dr. {d.first_name} {d.last_name} ({d.specialization || "General Medicine"})
                              </MenuItem>
                            ))}
                         </StyledTextField>
                       </Form.Item>
                     </Grid.Column>
                   </Grid.Row>

                  <TightGridRow>
                    <Grid.Column>
                      <Form.Item name="department">
                        <StyledTextField select label="Department">
                          <MenuItem value="General Medicine">General Medicine</MenuItem>
                          <MenuItem value="Cardiology">Cardiology</MenuItem>
                          <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                          <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                          <MenuItem value="Dermatology">Dermatology</MenuItem>
                          <MenuItem value="Neurology">Neurology</MenuItem>
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item name="duration_minutes">
                        <StyledTextField select label="Duration">
                          <MenuItem value={15}>15 Minutes</MenuItem>
                          <MenuItem value={30}>30 Minutes</MenuItem>
                          <MenuItem value={45}>45 Minutes</MenuItem>
                          <MenuItem value={60}>60 Minutes</MenuItem>
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                  </TightGridRow>
                </Grid>

                <SectionHeader>Schedule Date & Time</SectionHeader>
                <Grid columns={2} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Item
                        name="appointment_date"
                        rules={[{ required: true, message: "Date is required" }]}
                      >
                        <StyledDatePicker />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item
                        name="appointment_time"
                        rules={[{ required: true, message: "Time slot is required" }]}
                      >
                        <StyledTimePicker format="HH:mm" />
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <SectionHeader>Details & Priority</SectionHeader>
                <Grid columns={3} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Item name="priority">
                        <StyledTextField select label="Priority">
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item name="status">
                        <StyledTextField select label="Status">
                          <MenuItem value="Scheduled">Scheduled</MenuItem>
                          <MenuItem value="Confirmed">Confirmed</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>
                  <TightGridRow>
                    <Grid.Column width={16}>
                      <Form.Item name="reason">
                        <StyledTextField
                          label="Reason for Visit"
                          placeholder="e.g. Regular health examination, cardiovascular check"
                          multiline
                          rows={3}
                        />
                      </Form.Item>
                    </Grid.Column>
                  </TightGridRow>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <StyledButton variant="outlined" onClick={() => navigate("/appointments")}>
                    Cancel
                  </StyledButton>
                  <StyledButton variant="contained" type="submit" disabled={loading}>
                    {loading ? "Scheduling..." : isEdit ? "Update Appointment" : "Book Appointment"}
                  </StyledButton>
                </Box>
              </Form>
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </FormContainer>
  );
}
