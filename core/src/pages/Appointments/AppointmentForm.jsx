import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, message, DatePicker, TimePicker } from "antd";
import { Grid, Header, Icon } from "semantic-ui-react";
import { MenuItem, Box } from "@mui/material";
import useAppointments from "../../modules/appointments/hooks/useAppointments";
import usePatients from "../../modules/patients/hooks/usePatients";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledAlert,
} from "../../components/common";
import styled from "styled-components";

const FormContainer = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors?.background || "#0f1117"};
  min-height: 100%;
`;

const SectionHeader = styled.h4`
  color: #4f8ef7;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || "#2a2d3e"};
  padding-bottom: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 13px;
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
  const [doctors, setDoctors] = useState([]);
  const [conflictError, setConflictError] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchPatients();

    const loadDoctors = async () => {
      try {
        const res = await axiosClient.get("/auth/staff");
        const list = res.data?.payload?.data || [];
        setDoctors(list);
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
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <StyledButton
                variant="outlined"
                onClick={() => navigate("/appointments")}
                sx={{ mr: 2 }}
              >
                <Icon name="arrow left" style={{ margin: 0 }} />
              </StyledButton>
              <Header as="h2" style={{ color: "#e8eaf6", margin: 0 }}>
                {isEdit ? "Reschedule Appointment Slot" : "Schedule New Appointment"}
              </Header>
            </div>
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
                  priority: "Medium",
                  status: "Scheduled",
                  department: "General Medicine",
                  duration_minutes: 30,
                }}
              >
                {(conflictError || apiError) && (
                  <StyledAlert severity="error" style={{ marginBottom: "20px" }}>
                    {conflictError || apiError}
                  </StyledAlert>
                )}

                <SectionHeader>Encounter Information</SectionHeader>
                <Grid columns={2} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Item
                        name="patient_id"
                        rules={[{ required: true, message: "Please select a patient" }]}
                      >
                        <StyledTextField select label="Patient" defaultValue="">
                          <MenuItem value="">Select Patient</MenuItem>
                          {patients.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.first_name} {p.last_name} ({p.patient_code})
                            </MenuItem>
                          ))}
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item
                        name="provider_id"
                        rules={[{ required: true, message: "Please select a provider" }]}
                      >
                        <StyledTextField select label="Doctor" defaultValue="">
                          <MenuItem value="">Select Doctor</MenuItem>
                          {doctors.map((d) => (
                            <MenuItem key={d.id} value={d.id}>
                              Dr. {d.first_name} {d.last_name} ({d.role_name || "Provider"})
                            </MenuItem>
                          ))}
                        </StyledTextField>
                      </Form.Item>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row style={{ paddingTop: 0 }}>
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
                  </Grid.Row>
                </Grid>

                <SectionHeader>Schedule Date & Time</SectionHeader>
                <Grid columns={2} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Item
                        name="appointment_date"
                        rules={[{ required: true, message: "Date is required" }]}
                      >
                        <DatePicker style={{ width: "100%", height: 50, background: "#1e2230", border: "1px solid #2a2d3e", color: "#ffffff" }} />
                      </Form.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Item
                        name="appointment_time"
                        rules={[{ required: true, message: "Time slot is required" }]}
                      >
                        <TimePicker format="HH:mm" style={{ width: "100%", height: 50, background: "#1e2230", border: "1px solid #2a2d3e", color: "#ffffff" }} />
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
                  <Grid.Row style={{ paddingTop: 0 }}>
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
                  </Grid.Row>
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
