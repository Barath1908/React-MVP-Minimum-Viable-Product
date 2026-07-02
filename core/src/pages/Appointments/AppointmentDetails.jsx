import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Header, Icon } from "semantic-ui-react";
import useAppointments from "../../modules/appointments/hooks/useAppointments";
import usePatients from "../../modules/patients/hooks/usePatients";
import axiosClient from "../../services/axiosClient";
import {
  StyledButton,
  StyledCard,
  StyledAlert,
} from "../../components/common";
import styled from "styled-components";
import { Box } from "@mui/material";

const Container = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors?.background || "#0f1117"};
  min-height: 100%;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 16px;
`;

const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors?.textSecondary || "#9094a6"};
  margin-bottom: 4px;
  letter-spacing: 0.05em;
`;

const Value = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.textPrimary || "#ffffff"};
`;

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAppointment, loading, error, fetchAppointmentById } = useAppointments();
  
  const { patients, fetchPatients } = usePatients();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (id) {
      fetchAppointmentById(id);
    }
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
  }, [id, fetchAppointmentById, fetchPatients]);

  if (loading) {
    return (
      <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Icon name="spinner" loading size="huge" style={{ color: "#4f8ef7" }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StyledAlert severity="error">{error}</StyledAlert>
      </Container>
    );
  }

  if (!currentAppointment) {
    return (
      <Container>
        <StyledAlert severity="warning">Appointment slot not found.</StyledAlert>
      </Container>
    );
  }

  const patient = patients.find((p) => p.id === currentAppointment.patient_id);
  const doctor = doctors.find((d) => d.id === currentAppointment.provider_id);

  return (
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <DetailHeader>
              <div style={{ display: "flex", alignItems: "center" }}>
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate("/appointments")}
                  sx={{ mr: 2 }}
                >
                  <Icon name="arrow left" style={{ margin: 0 }} />
                </StyledButton>
                <div>
                  <Header as="h2" style={{ color: "#e8eaf6", margin: 0 }}>
                    Appointment Details
                  </Header>
                  <span style={{ color: "#9094a6", fontSize: "13px" }}>
                    ID Reference: <strong style={{ color: "#4f8ef7" }}>APT-{String(currentAppointment.id).padStart(4, "0")}</strong>
                  </span>
                </div>
              </div>
              {String(currentAppointment.status).toLowerCase() !== "cancelled" && (
                <StyledButton
                  variant="contained"
                  onClick={() => navigate(`/appointments/edit/${currentAppointment.id}`)}
                >
                  Reschedule Slot
                </StyledButton>
              )}
            </DetailHeader>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <StyledCard>
              <Header as="h3" style={{ color: "#e8eaf6", borderBottom: "1px solid #2a2d3e", paddingBottom: "10px" }}>
                <Icon name="calendar check" /> Appointment Status & Timing
              </Header>
              <InfoGrid>
                <div>
                  <Label>Scheduled Date & Time</Label>
                  <Value>{new Date(currentAppointment.scheduled_at).toLocaleString()}</Value>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Value>{currentAppointment.duration_minutes} Minutes</Value>
                </div>
                <div>
                  <Label>Current Booking Status</Label>
                  <Value style={{ color: currentAppointment.status === "Cancelled" ? "#ff5252" : "#4caf50" }}>
                    {currentAppointment.status}
                  </Value>
                </div>
                <div>
                  <Label>Encounter Priority</Label>
                  <Value>{currentAppointment.priority || "Medium"}</Value>
                </div>
              </InfoGrid>

              <Header as="h3" style={{ color: "#e8eaf6", borderBottom: "1px solid #2a2d3e", paddingBottom: "10px", marginTop: "32px" }}>
                <Icon name="user" /> Patient Information
              </Header>
              <InfoGrid>
                <div>
                  <Label>Full Name</Label>
                  <Value>
                    {patient ? `${patient.first_name} ${patient.last_name}` : `Patient (ID: ${currentAppointment.patient_id})`}
                  </Value>
                </div>
                <div>
                  <Label>Patient ID</Label>
                  <Value>{patient ? `#${patient.id}` : "N/A"}</Value>
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Value>{patient?.phone || "N/A"}</Value>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Value>{patient?.email || "N/A"}</Value>
                </div>
              </InfoGrid>

              <Header as="h3" style={{ color: "#e8eaf6", borderBottom: "1px solid #2a2d3e", paddingBottom: "10px", marginTop: "32px" }}>
                <Icon name="doctor" /> Clinician Information
              </Header>
              <InfoGrid>
                <div>
                  <Label>Assigned Doctor</Label>
                  <Value>
                    {doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : `Clinician (ID: ${currentAppointment.provider_id})`}
                  </Value>
                </div>
                <div>
                  <Label>Department</Label>
                  <Value>{currentAppointment.department || "General Medicine"}</Value>
                </div>
              </InfoGrid>

              <Header as="h3" style={{ color: "#e8eaf6", borderBottom: "1px solid #2a2d3e", paddingBottom: "10px", marginTop: "32px" }}>
                <Icon name="file alternate" /> Reason for Encounter
              </Header>
              <Box sx={{ mt: 2, p: 2, borderRadius: "8px", background: "#1e2230", border: "1px solid #2a2d3e" }}>
                <Value style={{ fontStyle: "italic" }}>
                  {currentAppointment.reason || "No clinical reasons specified."}
                </Value>
              </Box>
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
