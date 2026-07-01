import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessagesRequest,
  sendMessageRequest,
  markMessageReadRequest,
  clearChat,
} from "../chatSlice";

const useChat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const error = useSelector((state) => state.chat.error);

  const fetchMessages = useCallback((appointmentId) => {
    dispatch(fetchMessagesRequest(appointmentId));
  }, [dispatch]);

  const sendMessage = useCallback((appointmentId, content, isNote = 0) => {
    dispatch(
      sendMessageRequest({
        appointment_id: appointmentId,
        content,
        is_note: isNote ? 1 : 0,
      })
    );
  }, [dispatch]);

  const markAsRead = useCallback((messageId) => {
    dispatch(markMessageReadRequest(messageId));
  }, [dispatch]);

  const resetChat = useCallback(() => {
    dispatch(clearChat());
  }, [dispatch]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    markAsRead,
    resetChat,
  };
};

export default useChat;
