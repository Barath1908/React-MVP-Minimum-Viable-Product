import React from "react";
import styled from "styled-components";
import { Grid, Icon, Header } from "semantic-ui-react";
import { StyledCard } from "../../components/common";

const HistoryWrapper = styled.div`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors?.textPrimary || "#ffffff"};
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors?.inputBackground || "#1e2230"};
  border: 1px solid ${({ theme }) => theme.colors?.border || "#2a2d3e"};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
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
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
`;

const NoteItem = styled.div`
  border-left: 3px solid #4f8ef7;
  padding-left: 12px;
  margin-bottom: 12px;
`;

export default function MedicalHistory({ patient }) {
  if (!patient) return null;

  return (
    <HistoryWrapper>
      <Grid stackable>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as="h3" style={{ color: "#e8eaf6" }}>
              <Icon name="pills" /> Allergies & Medications
            </Header>
            <InfoBox>
              <Label>Known Allergies</Label>
              <Value style={{ color: patient.allergies ? "#ff5252" : "inherit" }}>
                {patient.allergies || "No known drug/food allergies reported."}
              </Value>
            </InfoBox>
            <InfoBox>
              <Label>Current Medications</Label>
              <Value>
                {patient.current_medications || "No active medications recorded."}
              </Value>
            </InfoBox>
          </Grid.Column>

          <Grid.Column>
            <Header as="h3" style={{ color: "#e8eaf6" }}>
              <Icon name="history" /> Medical History & Diagnoses
            </Header>
            <InfoBox>
              <Label>Significant Medical Conditions</Label>
              <Value>
                {patient.medical_history || "No chronic illnesses or diagnoses recorded."}
              </Value>
            </InfoBox>
            <InfoBox>
              <Label>Past Surgical History</Label>
              <Value>
                {patient.surgical_history || "No past surgical events logged."}
              </Value>
            </InfoBox>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h3" style={{ color: "#e8eaf6" }}>
              <Icon name="file alternate outline" /> Clinical Encounters & Doctor Notes
            </Header>
            <StyledCard>
              <NoteItem>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ color: "#4f8ef7" }}>Initial Patient Intake Consultation</strong>
                  <span style={{ color: "#9094a6", fontSize: "12px" }}>
                    {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                <Value style={{ color: "#d0d4e6" }}>
                  Patient registered context securely under workspace subdomain. Clinical records encrypted.
                  No secondary complications reported.
                </Value>
              </NoteItem>
              
              {patient.doctor_notes && (
                <NoteItem>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ color: "#4f8ef7" }}>Physician Follow-up</strong>
                  </div>
                  <Value style={{ color: "#d0d4e6" }}>{patient.doctor_notes}</Value>
                </NoteItem>
              )}
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </HistoryWrapper>
  );
}
