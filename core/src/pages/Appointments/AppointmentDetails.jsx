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

const Container = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100%;
`;

const LoadingContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const LoadingSpinner = styled(Icon)`
  && {
    color: ${({ theme }) => theme.colors.primary} !important;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PageTitle = styled(Header)`
  && {
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }
`;

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;

const PrimaryHighlight = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
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
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  letter-spacing: 0.05em;
`;

const Value = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatusValue = styled(Value)`
  && {
    color: ${({ status, theme }) => status === "Cancelled" ? theme.colors.danger : theme.colors.success} !important;
  }
`;

const CardSectionHeader = styled(Header)`
  && {
    color: ${({ theme }) => theme.colors.primary} !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border} !important;
    padding-bottom: 10px !important;
    margin-top: ${({ mt }) => mt || "0"} !important;
    font-weight: 600 !important;
  }
`;

const ReasonBox = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.inputBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ItalicValue = styled(Value)`
  font-style: italic;
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
      <LoadingContainer>
        <LoadingSpinner name="spinner" loading size="huge" />
      </LoadingContainer>
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
              <HeaderInfoContainer>
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate("/appointments")}
                  sx={{ mr: 2 }}
                >
                  <Icon name="arrow left" style={{ margin: 0 }} />
                </StyledButton>
                <div>
                  <PageTitle as="h2">
                    Appointment Details
                  </PageTitle>
                  <Subtitle>
                    ID Reference: <PrimaryHighlight>APT-{String(currentAppointment.id).padStart(4, "0")}</PrimaryHighlight>
                  </Subtitle>
                </div>
              </HeaderInfoContainer>
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
              <CardSectionHeader as="h3">
                <Icon name="calendar check" /> Appointment Status & Timing
              </CardSectionHeader>
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
                  <StatusValue status={currentAppointment.status}>
                    {currentAppointment.status}
                  </StatusValue>
                </div>
                <div>
                  <Label>Encounter Priority</Label>
                  <Value>{currentAppointment.priority || "Medium"}</Value>
                </div>
              </InfoGrid>

              <CardSectionHeader as="h3" mt="32px">
                <Icon name="user" /> Patient Information
              </CardSectionHeader>
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

              <CardSectionHeader as="h3" mt="32px">
                <Icon name="doctor" /> Clinician Information
              </CardSectionHeader>
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

              <CardSectionHeader as="h3" mt="32px">
                <Icon name="file alternate" /> Reason for Encounter
              </CardSectionHeader>
              <ReasonBox>
                <ItalicValue>
                  {currentAppointment.reason || "No clinical reasons specified."}
                </ItalicValue>
              </ReasonBox>
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
