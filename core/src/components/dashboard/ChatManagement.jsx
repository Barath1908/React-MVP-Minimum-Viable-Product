import { useEffect, useState, useRef } from "react";
import { Grid, Container, Header, Icon } from "semantic-ui-react";
import { MenuItem, Box, Typography, CardContent, Divider } from "@mui/material";
import styled from "styled-components";
import useChat from "../../modules/chat/hooks/useChat";
import useAuth from "../../modules/auth/hooks/useAuth";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledAlert,
} from "../common";

// ---------- Styled Components ----------
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  gap: 20px;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const DualPane = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  min-height: 0; /* Important for flex child scrolling */
`;

const PaneCard = styled(StyledCard)`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme?.colors?.sidebar || "#09090b"} !important;
  border: 1px solid ${({ theme }) => theme?.colors?.border || "#1e2130"} !important;
  min-height: 0;
  border-radius: 8px !important;

  .MuiCardContent-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px !important;
    min-height: 0;
  }
`;

const ThreadHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme?.colors?.textPrimary || "#ffffff"};
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
  padding: 15px !important;
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  
  align-self: ${props => props.$isMe ? "flex-end" : "flex-start"};
  background-color: ${props => props.$isMe 
    ? (props.theme.colors?.primary || '#7c5cbf') 
    : 'rgba(144, 148, 166, 0.12)'};
  color: ${props => props.$isMe ? "#ffffff" : (props.theme.colors?.textPrimary || '#ffffff')};
  border-bottom-right-radius: ${props => props.$isMe ? "2px" : "12px"};
  border-bottom-left-radius: ${props => props.$isMe ? "12px" : "2px"};
`;

const MessageMeta = styled.span`
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
  text-align: right;
  color: ${props => props.$isMe ? "#e2d9f3" : (props.theme.colors?.textSecondary || '#9094a6')};
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ChatManagement = () => {
  const { user } = useAuth();
  const { messages, loading, error, fetchMessages, sendMessage, resetChat } = useChat();

  const [appointments, setAppointments] = useState([]);
  const [apptsLoading, setApptsLoading] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState("");
  const [patients, setPatients] = useState([]);

  const [notesInput, setNotesInput] = useState("");
  const [chatInput, setChatInput] = useState("");

  const notesEndRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadAppointmentsAndPatients();
  }, []);

  useEffect(() => {
    if (selectedApptId) {
      fetchMessages(selectedApptId);
      // Setup polling for new messages every 5 seconds
      const timer = setInterval(() => {
        fetchMessages(selectedApptId);
      }, 5000);
      return () => clearInterval(timer);
    } else {
      resetChat();
    }
  }, [selectedApptId, fetchMessages, resetChat]);

  // Scroll to bottom when messages update
  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadAppointmentsAndPatients = async () => {
    try {
      setApptsLoading(true);
      // Fetch patients to map IDs to names
      const ptRes = await axiosClient.get("/patients");
      const ptData = ptRes?.data?.payload?.data ?? ptRes?.data ?? [];
      setPatients(ptData);

      // Fetch appointments
      const appRes = await axiosClient.get("/appointments");
      const appData = appRes?.data?.payload?.data ?? appRes?.data ?? [];
      setAppointments(appData);
    } catch (err) {
      console.error("Failed to load initial chat selectors", err);
    } finally {
      setApptsLoading(false);
    }
  };

  const getPatientName = (patientId) => {
    const pt = patients.find((p) => p.id === patientId);
    return pt ? `${pt.first_name} ${pt.last_name}` : `Patient #${patientId}`;
  };

  const handleSendNote = () => {
    if (!notesInput.trim()) return;
    sendMessage(selectedApptId, notesInput, 1); // isNote = 1
    setNotesInput("");
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendMessage(selectedApptId, chatInput, 0); // isNote = 0
    setChatInput("");
  };

  const notesList = messages.filter((m) => Number(m.is_note) === 1);
  const chatList = messages.filter((m) => Number(m.is_note) === 0);

  return (
    <ChatContainer>
      <ControlRow>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Communication & Notes
        </Typography>

        <Box sx={{ width: 350 }}>
          <StyledTextField
            select
            value={selectedApptId}
            onChange={(e) => setSelectedApptId(e.target.value)}
            label="Select Active Appointment Session"
            disabled={apptsLoading}
            slotProps={{
              select: {
                MenuProps: {
                  disablePortal: true,
                },
              },
            }}
          >
            <MenuItem value="">-- Select Appointment --</MenuItem>
            {appointments.map((appt) => (
              <MenuItem key={appt.id} value={appt.id}>
                {getPatientName(appt.patient_id)} - {dayjs(appt.appointment_date).format("MMM DD, YYYY")} ({appt.status})
              </MenuItem>
            ))}
          </StyledTextField>
        </Box>
      </ControlRow>

      {error && <StyledAlert severity="error">{error}</StyledAlert>}

      {!selectedApptId ? (
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed rgba(144, 148, 166, 0.3)", borderRadius: 2 }}>
          <Typography variant="body1" sx={{ color: "#9094a6" }}>
            Please select an active appointment session to begin messaging and logging notes.
          </Typography>
        </Box>
      ) : (
        <DualPane>
          {/* Left Pane: Clinical / Appointment Notes */}
          <PaneCard>
            <CardContent>
              <ThreadHeader>
                <Icon name="sticky note outline" style={{ margin: 0 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Appointment Clinical Notes
                </Typography>
              </ThreadHeader>
              <Divider sx={{ mb: 2, bgcolor: "rgba(144, 148, 166, 0.15)" }} />

              <MessagesList>
                {notesList.length === 0 ? (
                  <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", mt: 4 }}>
                    No notes recorded yet for this session.
                  </Typography>
                ) : (
                  notesList.map((m) => (
                    <MessageBubble key={m.id} $isMe={Number(m.sender_id) === Number(user?.id)}>
                      <div>{m.content}</div>
                      <MessageMeta $isMe={Number(m.sender_id) === Number(user?.id)}>
                        {dayjs(m.created_at).format("hh:mm A")}
                      </MessageMeta>
                    </MessageBubble>
                  ))
                )}
                <div ref={notesEndRef} />
              </MessagesList>

              <InputRow>
                <StyledTextField
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Type clinical note..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendNote()}
                  sx={{ flex: 1 }}
                />
                <StyledButton variant="contained" onClick={handleSendNote}>
                  Log Note
                </StyledButton>
              </InputRow>
            </CardContent>
          </PaneCard>

          {/* Right Pane: Colleague Internal Chat */}
          <PaneCard>
            <CardContent>
              <ThreadHeader>
                <Icon name="comments outline" style={{ margin: 0 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Internal Discussion Thread
                </Typography>
              </ThreadHeader>
              <Divider sx={{ mb: 2, bgcolor: "rgba(144, 148, 166, 0.15)" }} />

              <MessagesList>
                {chatList.length === 0 ? (
                  <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", mt: 4 }}>
                    No internal chat messages yet.
                  </Typography>
                ) : (
                  chatList.map((m) => (
                    <MessageBubble key={m.id} $isMe={Number(m.sender_id) === Number(user?.id)}>
                      <div>{m.content}</div>
                      <MessageMeta $isMe={Number(m.sender_id) === Number(user?.id)}>
                        {dayjs(m.created_at).format("hh:mm A")}
                      </MessageMeta>
                    </MessageBubble>
                  ))
                )}
                <div ref={chatEndRef} />
              </MessagesList>

              <InputRow>
                <StyledTextField
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Discuss with staff..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                  sx={{ flex: 1 }}
                />
                <StyledButton variant="contained" onClick={handleSendChat}>
                  Send
                </StyledButton>
              </InputRow>
            </CardContent>
          </PaneCard>
        </DualPane>
      )}
    </ChatContainer>
  );
};

export default ChatManagement;
