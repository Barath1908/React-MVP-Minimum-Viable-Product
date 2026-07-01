import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoicesRequest,
  fetchSummaryRequest,
  createInvoiceRequest,
  updateInvoiceRequest,
  recordPaymentRequest,
} from "../billingSlice";

const useBilling = () => {
  const dispatch = useDispatch();
  const invoices = useSelector((state) => state.billing.invoices);
  const summary = useSelector((state) => state.billing.summary);
  const loading = useSelector((state) => state.billing.loading);
  const error = useSelector((state) => state.billing.error);

  const fetchInvoices = useCallback(() => {
    dispatch(fetchInvoicesRequest());
  }, [dispatch]);

  const fetchSummary = useCallback(() => {
    dispatch(fetchSummaryRequest());
  }, [dispatch]);

  const createInvoice = useCallback((data) => {
    dispatch(createInvoiceRequest(data));
  }, [dispatch]);

  const updateInvoice = useCallback((id, data) => {
    dispatch(updateInvoiceRequest({ id, ...data }));
  }, [dispatch]);

  const recordPayment = useCallback((data) => {
    dispatch(recordPaymentRequest(data));
  }, [dispatch]);

  return {
    invoices,
    summary,
    loading,
    error,
    fetchInvoices,
    fetchSummary,
    createInvoice,
    updateInvoice,
    recordPayment,
  };
};

export default useBilling;
