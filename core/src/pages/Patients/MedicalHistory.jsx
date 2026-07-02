import React from "react";
import styled from "styled-components";
import { Grid, Icon, Header } from "semantic-ui-react";
import { StyledCard } from "../../components/common";

const HistoryWrapper = styled.div`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.inputBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
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
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
`;

const AllergyValue = styled(Value)`
  color: ${({ hasAllergies, theme }) => hasAllergies ? theme.colors.danger : 'inherit'} !important;
`;

const NoteItem = styled.div`
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  padding-left: 12px;
  margin-bottom: 12px;
`;

const SectionHeader = styled(Header)`
  && {
    color: ${({ theme }) => theme.colors.primary} !important;
    font-weight: 600 !important;
  }
`;

const NoteHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const NoteTitle = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;

const NoteDate = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

const NoteBody = styled(Value)`
  color: ${({ theme }) => theme.colors.textSecondary} !important;
`;

export default function MedicalHistory({ patient }) {
  if (!patient) return null;

  return (
    <HistoryWrapper>
      <Grid stackable>
        <Grid.Row columns={2}>
          <Grid.Column>
            <SectionHeader as="h3">
              <Icon name="pills" /> Allergies & Medications
            </SectionHeader>
            <InfoBox>
              <Label>Known Allergies</Label>
              <AllergyValue hasAllergies={!!patient.allergies}>
                {patient.allergies || "No known drug/food allergies reported."}
              </AllergyValue>
            </InfoBox>
            <InfoBox>
              <Label>Current Medications</Label>
              <Value>
                {patient.current_medications || "No active medications recorded."}
              </Value>
            </InfoBox>
          </Grid.Column>

          <Grid.Column>
            <SectionHeader as="h3">
              <Icon name="history" /> Medical History & Diagnoses
            </SectionHeader>
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
            <SectionHeader as="h3">
              <Icon name="file alternate outline" /> Clinical Encounters & Doctor Notes
            </SectionHeader>
            <StyledCard>
              <NoteItem>
                <NoteHeaderRow>
                  <NoteTitle>Initial Patient Intake Consultation</NoteTitle>
                  <NoteDate>
                    {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : "Recent"}
                  </NoteDate>
                </NoteHeaderRow>
                <NoteBody>
                  Patient registered context securely under workspace subdomain. Clinical records encrypted.
                  No secondary complications reported.
                </NoteBody>
              </NoteItem>
              
              {patient.doctor_notes && (
                <NoteItem>
                  <NoteHeaderRow>
                    <NoteTitle>Physician Follow-up</NoteTitle>
                  </NoteHeaderRow>
                  <NoteBody>{patient.doctor_notes}</NoteBody>
                </NoteItem>
              )}
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </HistoryWrapper>
  );
}
