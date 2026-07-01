import { useDispatch, useSelector } from "react-redux";

import {
  fetchRolesRequest,
  createRoleRequest,
  updateRoleRequest,
  deleteRoleRequest,
} from "../roleSlice";

const useRoles = () => {
  const dispatch = useDispatch();

  const { roles, loading, error } =
    useSelector(
      (state) => state.roles
    );

  return {
    roles,
    loading,
    error,

    fetchRoles: () =>
      dispatch(fetchRolesRequest()),

    createRole: (data) =>
      dispatch(
        createRoleRequest(data)
      ),

    updateRole: (id, data) =>
      dispatch(
        updateRoleRequest({
          id,
          data,
        })
      ),

    deleteRole: (id) =>
      dispatch(
        deleteRoleRequest(id)
      ),
  };
};

export default useRoles;