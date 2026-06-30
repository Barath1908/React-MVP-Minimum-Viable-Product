import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchInvoicesRequest,
  createInvoiceRequest,
  updateInvoiceRequest,
  deleteInvoiceRequest,
} from "../billingSlice";

const useBilling = () => {
  const dispatch =
    useDispatch();

  const {
    invoices,
    loading,
    error,
  } = useSelector(
    (state) => state.billing
  );

  return {
    invoices,
    loading,
    error,

    fetchInvoices: () =>
      dispatch(
        fetchInvoicesRequest()
      ),

    createInvoice: (
      data
    ) =>
      dispatch(
        createInvoiceRequest(
          data
        )
      ),

    updateInvoice: (
      id,
      data
    ) =>
      dispatch(
        updateInvoiceRequest({
          id,
          data,
        })
      ),

    deleteInvoice: (
      id
    ) =>
      dispatch(
        deleteInvoiceRequest(
          id
        )
      ),
  };
};

export default useBilling;