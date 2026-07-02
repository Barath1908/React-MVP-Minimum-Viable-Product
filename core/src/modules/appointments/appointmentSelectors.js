export const selectAppointmentState = (state) => state.appointments;

export const selectAppointmentsList = (state) => state.appointments?.appointments || [];
export const selectCurrentAppointment = (state) => state.appointments?.currentAppointment;
export const selectAppointmentsLoading = (state) => state.appointments?.loading || false;
export const selectAppointmentsError = (state) => state.appointments?.error || null;
