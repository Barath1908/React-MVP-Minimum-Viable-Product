import { useDispatch, useSelector } from "react-redux";

import {
  fetchStaffRequest,
  createStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "../staffSlice";

const useStaff = () => {
  const dispatch = useDispatch();

  const { staff, loading, error } =
    useSelector(
      (state) => state.staff
    );

  const fetchStaff = () => {
    dispatch(fetchStaffRequest());
  };

  const createStaff = (data) => {
    dispatch(createStaffRequest(data));
  };

  const updateStaff = (id, data) => {
    dispatch(
      updateStaffRequest({
        id,
        data,
      })
    );
  };

  const deleteStaff = (id) => {
    dispatch(deleteStaffRequest(id));
  };

  return {
    staff,
    loading,
    error,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
};

export default useStaff;