import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersRequest,
  addUserRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../userSlice";

const useUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  const fetchUsers = useCallback(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  const addUser = useCallback((data) => {
    dispatch(addUserRequest(data));
  }, [dispatch]);

  const updateUser = useCallback((id, data) => {
    dispatch(updateUserRequest({ id, ...data }));
  }, [dispatch]);

  const toggleUserStatus = useCallback((id, isActive) => {
    dispatch(updateUserRequest({ id, is_active: isActive ? 1 : 0 }));
  }, [dispatch]);

  const deleteUser = useCallback((id) => {
    dispatch(deleteUserRequest(id));
  }, [dispatch]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  };
};

export default useUsers;
