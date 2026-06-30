import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchPrescriptionsRequest,
  createPrescriptionRequest,
  updatePrescriptionRequest,
  deletePrescriptionRequest,
} from "../prescriptionSlice";

const usePrescriptions = () => {
  const dispatch =
    useDispatch();

  const {
    prescriptions,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.prescriptions
  );

  return {
    prescriptions,
    loading,
    error,

    fetchPrescriptions: () =>
      dispatch(
        fetchPrescriptionsRequest()
      ),

    createPrescription: (
      data
    ) =>
      dispatch(
        createPrescriptionRequest(
          data
        )
      ),

    updatePrescription: (
      id,
      data
    ) =>
      dispatch(
        updatePrescriptionRequest({
          id,
          data,
        })
      ),

    deletePrescription: (
      id
    ) =>
      dispatch(
        deletePrescriptionRequest(
          id
        )
      ),
  };
};

export default usePrescriptions;