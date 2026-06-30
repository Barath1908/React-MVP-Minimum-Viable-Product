// import { useDispatch, useSelector } from "react-redux";

// import {
//     fetchUsersRequest,
//     createUserRequest,
//     updateUserRequest,
//     deleteUserRequest,
// } from "../userSlice";

// const useUsers = () => {

//     const dispatch = useDispatch();

//     const { users, loading, error } = useSelector(
//         (state) => state.users
//     );

//     return {

//         users,

//         loading,

//         error,

//         getUsers: () => dispatch(fetchUsersRequest()),

//         createUser: (data) =>
//             dispatch(createUserRequest(data)),

//         updateUser: (id, data) =>
//             dispatch(updateUserRequest({ id, data })),

//         deleteUser: (id) =>
//             dispatch(deleteUserRequest(id)),

//     };

// };

// export default useUsers;

import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsersRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../userSlice";

const useUsers = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector(
    (state) => state.users
  );

  const fetchUsers = () => {
    dispatch(fetchUsersRequest());
  };

  const createUser = (data) => {
    dispatch(createUserRequest(data));
  };

  const updateUser = (id, data) => {
    dispatch(updateUserRequest({ id, data }));
  };

  const deleteUser = (id) => {
    dispatch(deleteUserRequest(id));
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useUsers;