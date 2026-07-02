import { createSelector } from "@reduxjs/toolkit";

export const selectPatientState = (state) => state.patients;

export const selectPatientsList = (state) => state.patients?.patients || [];
export const selectCurrentPatient = (state) => state.patients?.currentPatient;
export const selectPatientsLoading = (state) => state.patients?.loading || false;
export const selectPatientsError = (state) => state.patients?.error || null;
export const selectPatientSearchTerm = (state) => state.patients?.searchTerm || "";

export const selectFilteredPatients = createSelector(
  [selectPatientsList, selectPatientSearchTerm],
  (patients, searchTerm) => {
    if (!searchTerm) return patients;
    const term = searchTerm.toLowerCase().trim();

    return patients.filter((patient) => {
      if (!patient) return false;
      
      const code = String(patient.patient_code || "").toLowerCase();
      const first = String(patient.first_name || "").toLowerCase();
      const last = String(patient.last_name || "").toLowerCase();
      const email = String(patient.email || "").toLowerCase();
      const phone = String(patient.phone || "").toLowerCase();
      const fullName = `${first} ${last}`.trim();

      return (
        code.includes(term) ||
        first.includes(term) ||
        last.includes(term) ||
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      );
    });
  }
);
