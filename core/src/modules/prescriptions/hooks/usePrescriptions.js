import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPrescriptionsRequest,
  createPrescriptionRequest,
  verifyPrescriptionRequest,
  dispensePrescriptionRequest,
} from "../prescriptionSlice";

const usePrescriptions = () => {
  const dispatch = useDispatch();
  const prescriptions = useSelector((state) => state.prescriptions.prescriptions);
  const loading = useSelector((state) => state.prescriptions.loading);
  const error = useSelector((state) => state.prescriptions.error);

  const fetchPrescriptions = useCallback(() => {
    dispatch(fetchPrescriptionsRequest());
  }, [dispatch]);

  const issuePrescription = useCallback((data) => {
    dispatch(createPrescriptionRequest(data));
  }, [dispatch]);

  const verifyPrescription = useCallback((id) => {
    dispatch(verifyPrescriptionRequest(id));
  }, [dispatch]);

  const dispensePrescription = useCallback((id) => {
    dispatch(dispensePrescriptionRequest(id));
  }, [dispatch]);

  return {
    prescriptions,
    loading,
    error,
    fetchPrescriptions,
    issuePrescription,
    verifyPrescription,
    dispensePrescription,
  };
};

export default usePrescriptions;
