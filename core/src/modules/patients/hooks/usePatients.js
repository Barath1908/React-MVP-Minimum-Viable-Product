import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatientsRequest,
  fetchPatientByIdRequest,
  createPatientRequest,
  updatePatientRequest,
  deletePatientRequest,
  setSearchTerm,
} from "../patientSlice";
import {
  selectFilteredPatients,
  selectCurrentPatient,
  selectPatientsLoading,
  selectPatientsError,
  selectPatientSearchTerm,
} from "../patientSelectors";

const usePatients = () => {
  const dispatch = useDispatch();
  
  const patients = useSelector(selectFilteredPatients);
  const currentPatient = useSelector(selectCurrentPatient);
  const loading = useSelector(selectPatientsLoading);
  const error = useSelector(selectPatientsError);
  const searchTerm = useSelector(selectPatientSearchTerm);

  const fetchPatients = useCallback(() => {
    dispatch(fetchPatientsRequest());
  }, [dispatch]);

  const fetchPatientById = useCallback((id) => {
    dispatch(fetchPatientByIdRequest(id));
  }, [dispatch]);

  const createPatient = useCallback((data, onSuccess, onFailure) => {
    dispatch(createPatientRequest({ data, onSuccess, onFailure }));
  }, [dispatch]);

  const updatePatient = useCallback((id, data, onSuccess, onFailure) => {
    dispatch(updatePatientRequest({ id, data, onSuccess, onFailure }));
  }, [dispatch]);

  const deletePatient = useCallback((id) => {
    dispatch(deletePatientRequest(id));
  }, [dispatch]);

  const searchPatients = useCallback((term) => {
    dispatch(setSearchTerm(term));
  }, [dispatch]);

  return {
    patients,
    currentPatient,
    loading,
    error,
    searchTerm,
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
  };
};

export default usePatients;
