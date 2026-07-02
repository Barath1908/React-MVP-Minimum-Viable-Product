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
  background: ${({ theme }) => theme.colors?.background || "#0f1117"};
  min-height: 100%;
`;

const ProfileHeader = styled.div`
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
      <ProfileContainer style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Icon name="spinner" loading size="huge" style={{ color: "#4f8ef7" }} />
      </ProfileContainer>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate("/patients")}
                  sx={{ mr: 2 }}
                >
                  <Icon name="arrow left" style={{ margin: 0 }} />
                </StyledButton>
                <div>
                  <Header as="h2" style={{ color: "#e8eaf6", margin: 0 }}>
                    {patientName}
                  </Header>
                  <span style={{ color: "#9094a6", fontSize: "13px" }}>
                    Patient ID: <strong style={{ color: "#4f8ef7" }}>#{currentPatient.id}</strong>
                  </span>
                </div>
              </div>
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
            <Menu pointing secondary inverted style={{ borderColor: "#2a2d3e", marginBottom: "20px" }}>
              <Menu.Item
                name="General Profile"
                active={activeTab === "general"}
                onClick={() => setActiveTab("general")}
                style={{ color: activeTab === "general" ? "#4f8ef7" : "#9094a6" }}
              />
              <Menu.Item
                name="Clinical Medical History"
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
                style={{ color: activeTab === "history" ? "#4f8ef7" : "#9094a6" }}
              />
            </Menu>

            {activeTab === "general" ? (
              <StyledCard>
                <Header as="h3" style={{ color: "#e8eaf6", borderBottom: "1px solid #2a2d3e", paddingBottom: "10px" }}>
                  <Icon name="address card" /> Personal & Medical Details
                </Header>
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
                    <Value style={{ color: "#ff5252", fontWeight: 700 }}>
                      {currentPatient.blood_group || "N/A"}
                    </Value>
                  </div>
                </InfoGrid>

                <Header as="h3" style={{ color: "#e8eaf6", borderBottom: "1px solid #2a2d3e", paddingBottom: "10px", marginTop: "32px" }}>
                  <Icon name="mail" /> Contact Information
                </Header>
                <InfoGrid>
                  <div>
                    <Label>Email Address</Label>
                    <Value>{currentPatient.email || "N/A"}</Value>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Value>{currentPatient.phone || "N/A"}</Value>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <Label>Residential Address</Label>
                    <Value>{currentPatient.address || "N/A"}</Value>
                  </div>
                </InfoGrid>

                <Header as="h3" style={{ color: "#e8eaf6", borderBottom: "1px solid #2a2d3e", paddingBottom: "10px", marginTop: "32px" }}>
                  <Icon name="shield" /> Emergency Contact
                </Header>
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
