import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Header, Icon, Menu } from "semantic-ui-react";
import usePatients from "../../modules/patients/hooks/usePatients";
import MedicalHistory from "./MedicalHistory";
import {
  StyledButton,
  StyledCard,
  StyledAlert,
} from "../../components/common";
import styled from "styled-components";

const ProfileContainer = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100%;
`;

const LoadingContainer = styled(ProfileContainer)`
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

const ProfileHeader = styled.div`
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

const PatientSub = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;

const PatientIdHighlight = styled.strong`
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

const DangerValue = styled(Value)`
  && {
    color: ${({ theme }) => theme.colors.danger} !important;
    font-weight: 700 !important;
  }
`;

const GridSpanTwo = styled.div`
  grid-column: span 2;
`;

const StyledMenu = styled(Menu)`
  &&& {
    border-color: ${({ theme }) => theme.colors.border} !important;
    margin-bottom: 20px !important;
    background: transparent !important;
    
    .item {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
      border-color: transparent !important;
      font-weight: 500;
      
      &:hover {
        color: ${({ theme }) => theme.colors.primaryHover} !important;
      }
      
      &.active {
        color: ${({ theme }) => theme.colors.primary} !important;
        border-color: ${({ theme }) => theme.colors.primary} !important;
      }
    }
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

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPatient, loading, error, fetchPatientById } = usePatients();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (id) {
      fetchPatientById(id);
    }
  }, [id, fetchPatientById]);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner name="spinner" loading size="huge" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <StyledAlert severity="error">{error}</StyledAlert>
      </ProfileContainer>
    );
  }

  if (!currentPatient) {
    return (
      <ProfileContainer>
        <StyledAlert severity="warning">Patient record not found.</StyledAlert>
      </ProfileContainer>
    );
  }

  const patientName = `${currentPatient.first_name || ""} ${currentPatient.last_name || ""}`;

  return (
    <ProfileContainer>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <ProfileHeader>
              <HeaderInfoContainer>
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate("/patients")}
                  sx={{ mr: 2 }}
                >
                  <Icon name="arrow left" style={{ margin: 0 }} />
                </StyledButton>
                <div>
                  <PageTitle as="h2">
                    {patientName}
                  </PageTitle>
                  <PatientSub>
                    Patient ID: <PatientIdHighlight>#{currentPatient.id}</PatientIdHighlight>
                  </PatientSub>
                </div>
              </HeaderInfoContainer>
              <StyledButton
                variant="contained"
                onClick={() => navigate(`/patients/edit/${currentPatient.id}`)}
              >
                Edit Profile
              </StyledButton>
            </ProfileHeader>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <StyledMenu pointing secondary>
              <Menu.Item
                name="General Profile"
                active={activeTab === "general"}
                onClick={() => setActiveTab("general")}
              />
              <Menu.Item
                name="Clinical Medical History"
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              />
            </StyledMenu>

            {activeTab === "general" ? (
              <StyledCard>
                <CardSectionHeader as="h3">
                  <Icon name="address card" /> Personal & Medical Details
                </CardSectionHeader>
                <InfoGrid>
                  <div>
                    <Label>Date of Birth</Label>
                    <Value>{currentPatient.date_of_birth || "N/A"}</Value>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Value>{currentPatient.age ? `${currentPatient.age} Years` : "N/A"}</Value>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Value>
                      {currentPatient.gender
                        ? currentPatient.gender.charAt(0).toUpperCase() + currentPatient.gender.slice(1)
                        : "N/A"}
                    </Value>
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <DangerValue>
                      {currentPatient.blood_group || "N/A"}
                    </DangerValue>
                  </div>
                </InfoGrid>

                <CardSectionHeader as="h3" mt="32px">
                  <Icon name="mail" /> Contact Information
                </CardSectionHeader>
                <InfoGrid>
                  <div>
                    <Label>Email Address</Label>
                    <Value>{currentPatient.email || "N/A"}</Value>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Value>{currentPatient.phone || "N/A"}</Value>
                  </div>
                  <GridSpanTwo>
                    <Label>Residential Address</Label>
                    <Value>{currentPatient.address || "N/A"}</Value>
                  </GridSpanTwo>
                </InfoGrid>

                <CardSectionHeader as="h3" mt="32px">
                  <Icon name="shield" /> Emergency Contact
                </CardSectionHeader>
                <InfoGrid>
                  <div>
                    <Label>Emergency Contact</Label>
                    <Value>{currentPatient.emergency_contact || "N/A"}</Value>
                  </div>
                </InfoGrid>
              </StyledCard>
            ) : (
              <MedicalHistory patient={currentPatient} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </ProfileContainer>
  );
}
