import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchMessagesRequest,
  sendMessageRequest,
  deleteMessageRequest,
} from "../chatSlice";

const useChat = () => {
  const dispatch =
    useDispatch();

  const {
    messages,
    loading,
    error,
  } = useSelector(
    (state) => state.chat
  );

  return {
    messages,
    loading,
    error,

    fetchMessages: () =>
      dispatch(
        fetchMessagesRequest()
      ),

    sendMessage: (data) =>
      dispatch(
        sendMessageRequest(
          data
        )
      ),

    deleteMessage: (id) =>
      dispatch(
        deleteMessageRequest(
          id
        )
      ),
  };
};

export default useChat;