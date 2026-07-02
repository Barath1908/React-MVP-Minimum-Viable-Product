import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointmentsRequest,
  fetchAppointmentByIdRequest,
  createAppointmentRequest,
  updateAppointmentRequest,
  deleteAppointmentRequest,
} from "../appointmentSlice";
import {
  selectAppointmentsList,
  selectCurrentAppointment,
  selectAppointmentsLoading,
  selectAppointmentsError,
} from "../appointmentSelectors";

const useAppointments = () => {
  const dispatch = useDispatch();

  const appointments = useSelector(selectAppointmentsList);
  const currentAppointment = useSelector(selectCurrentAppointment);
  const loading = useSelector(selectAppointmentsLoading);
  const error = useSelector(selectAppointmentsError);

  const fetchAppointments = useCallback((params) => {
    dispatch(fetchAppointmentsRequest(params));
  }, [dispatch]);

  const fetchAppointmentById = useCallback((id) => {
    dispatch(fetchAppointmentByIdRequest(id));
  }, [dispatch]);

  const createAppointment = useCallback((data, onSuccess, onFailure) => {
    dispatch(createAppointmentRequest({ data, onSuccess, onFailure }));
  }, [dispatch]);

  const updateAppointment = useCallback((id, data, onSuccess, onFailure) => {
    dispatch(updateAppointmentRequest({ id, data, onSuccess, onFailure }));
  }, [dispatch]);

  const deleteAppointment = useCallback((id) => {
    dispatch(deleteAppointmentRequest(id));
  }, [dispatch]);

  return {
    appointments,
    currentAppointment,
    loading,
    error,
    fetchAppointments,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};

export default useAppointments;
