import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchNotificationsRequest,
  createNotificationRequest,
  deleteNotificationRequest,
} from "../notificationSlice";

const useNotifications = () => {
  const dispatch =
    useDispatch();

  const {
    notifications,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.notifications
  );

  return {
    notifications,
    loading,
    error,

    fetchNotifications: () =>
      dispatch(
        fetchNotificationsRequest()
      ),

    createNotification: (
      data
    ) =>
      dispatch(
        createNotificationRequest(
          data
        )
      ),

    deleteNotification: (
      id
    ) =>
      dispatch(
        deleteNotificationRequest(
          id
        )
      ),
  };
};

export default useNotifications;