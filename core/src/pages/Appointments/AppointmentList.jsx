import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Modal, message, Select } from "antd";
import { Grid, Header, Icon } from "semantic-ui-react";
import useAppointments from "../../modules/appointments/hooks/useAppointments";
import usePatients from "../../modules/patients/hooks/usePatients";
import axiosClient from "../../services/axiosClient";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledAlert,
} from "../../components/common";
import styled from "styled-components";

const PageContainer = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors?.background || "#0f1117"};
  min-height: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusTag = styled(Tag)`
  && {
    border-radius: 4px;
    font-weight: 500;
    padding: 2px 8px;
  }
`;

export default function AppointmentList() {
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    deleteAppointment,
    updateAppointment,
  } = useAppointments();

  const { patients, fetchPatients } = usePatients();
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();

    // Fetch Doctors list directly
    const loadDoctors = async () => {
      try {
        const res = await axiosClient.get("/auth/staff");
        const list = res.data?.payload?.data || [];
        setDoctors(list);
      } catch (err) {
        console.error(err);
      }
    };
    loadDoctors();
  }, [fetchAppointments, fetchPatients]);

  const handleCancelClick = (id) => {
    setSelectedApptId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedApptId) {
      const appt = appointments.find((a) => a.id === selectedApptId);
      const payload = {
        patient_id: appt?.patient_id,
        provider_id: appt?.provider_id,
        scheduled_at: appt?.scheduled_at,
        duration_minutes: appt?.duration_minutes || 30,
        reason: appt?.reason || "",
        notes: appt?.notes || "",
        status: "Cancelled"
      };
      updateAppointment(
        selectedApptId,
        payload,
        () => {
          message.success("Appointment cancelled successfully!");
          fetchAppointments();
          setCancelModalOpen(false);
          setSelectedApptId(null);
        },
        (err) => {
          message.error(err || "Failed to cancel appointment.");
        }
      );
    }
  };

  const handleDeleteClick = (id) => {
    Modal.confirm({
      title: "Delete Appointment",
      content: "Are you sure you want to completely delete this appointment slot?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteAppointment(id);
        message.success("Appointment record deleted successfully!");
        fetchAppointments();
      },
    });
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "scheduled":
        return "blue";
      case "confirmed":
        return "green";
      case "completed":
        return "purple";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Filter list
  const filteredAppointments = appointments.filter((appt) => {
    if (!appt) return false;
    
    // Status Filter
    if (statusFilter !== "all" && String(appt.status).toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    // Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // Match Doctor/Provider
      const doctor = doctors.find((d) => d.id === appt.provider_id);
      const docName = doctor ? `${doctor.first_name} ${doctor.last_name}`.toLowerCase() : "";
      
      // Match Patient
      const patient = patients.find((p) => p.id === appt.patient_id);
      const patName = patient ? `${patient.first_name} ${patient.last_name}`.toLowerCase() : "";
      const patId = patient ? String(patient.id).toLowerCase() : "";

      return (
        docName.includes(term) ||
        patName.includes(term) ||
        patId.includes(term) ||
        `#${patId}`.includes(term)
      );
    }

    return true;
  });

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <strong style={{ color: "#4f8ef7" }}>APT-{String(id).padStart(4, "0")}</strong>,
    },
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => {
        const patient = patients.find((p) => p.id === record.patient_id);
        return patient ? `${patient.first_name} ${patient.last_name}` : `Patient (ID: ${record.patient_id})`;
      },
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => {
        const doctor = doctors.find((d) => d.id === record.provider_id);
        return doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : `Doctor (ID: ${record.provider_id})`;
      },
    },
    {
      title: "Scheduled Date & Time",
      dataIndex: "scheduled_at",
      key: "scheduled_at",
      render: (date) => (date ? new Date(date).toLocaleString() : "N/A"),
      sorter: (a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at),
    },
    {
      title: "Duration",
      dataIndex: "duration_minutes",
      key: "duration_minutes",
      render: (dur) => `${dur} min`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <StatusTag color={getStatusColor(status)}>
          {status}
        </StatusTag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <ActionButtons>
          <StyledButton
            variant="outlined"
            size="small"
            onClick={() => navigate(`/appointments/${record.id}`)}
          >
            Details
          </StyledButton>
          {String(record.status).toLowerCase() !== "cancelled" && (
            <>
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => navigate(`/appointments/edit/${record.id}`)}
              >
                Edit
              </StyledButton>
              <StyledButton
                variant="outlined"
                size="small"
                color="warning"
                onClick={() => handleCancelClick(record.id)}
              >
                Cancel
              </StyledButton>
            </>
          )}
          <StyledButton
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDeleteClick(record.id)}
          >
            Delete
          </StyledButton>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageContainer>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Toolbar>
              <Header as="h2" style={{ color: "#e8eaf6", margin: 0 }}>
                Appointments & Scheduling
              </Header>
              <StyledButton
                variant="contained"
                onClick={() => navigate("/appointments/new")}
              >
                Create Appointment
              </StyledButton>
            </Toolbar>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <StyledCard>
              <Toolbar style={{ marginBottom: "16px" }}>
                <FilterWrapper>
                  <StyledTextField
                    label="Search Patient/Doctor"
                    placeholder="Search name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 240 }}
                  />
                  
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: 160, height: 40 }}
                    styles={{ popup: { root: { background: "#141622", color: "#ffffff" } } }}
                  >
                    <Select.Option value="all">All Statuses</Select.Option>
                    <Select.Option value="scheduled">Scheduled</Select.Option>
                    <Select.Option value="confirmed">Confirmed</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                  </Select>
                </FilterWrapper>
              </Toolbar>

              {error && (
                <StyledAlert severity="error" style={{ marginBottom: "16px" }}>
                  {error}
                </StyledAlert>
              )}

              <Table
                columns={columns}
                dataSource={filteredAppointments}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                locale={{
                  emptyText: (
                    <EmptyStateContainer style={{ padding: "40px", textAlign: "center", color: "#9094a6" }}>
                      <Icon name="calendar alternate outline" size="huge" style={{ marginBottom: "12px" }} />
                      <p>No appointments booked. Click 'Create Appointment' to schedule one.</p>
                    </EmptyStateContainer>
                  ),
                }}
              />
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal
        title="Cancel Appointment"
        open={cancelModalOpen}
        onOk={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
        okText="Cancel Appointment"
        okType="danger"
        cancelText="Keep Slot"
      >
        <p>Are you sure you want to cancel this appointment slot?</p>
      </Modal>
    </PageContainer>
  );
}

// Styling helper
const EmptyStateContainer = styled.div``;
