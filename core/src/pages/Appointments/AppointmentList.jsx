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
import styled, { useTheme } from "styled-components";

const PageContainer = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
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

const SearchToolbar = styled(Toolbar)`
  margin-bottom: 16px;
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

const PageTitle = styled(Header)`
  && {
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }
`;

const StyledTable = styled(Table)`
  && {
    .ant-table {
      background: ${({ theme }) => theme.colors.backgroundCard} !important;
      color: ${({ theme }) => theme.colors.textPrimary} !important;
    }
    .ant-table-thead > tr > th {
      background: ${({ theme }) => theme.colors.tableHeader} !important;
      color: ${({ theme }) => theme.colors.textPrimary} !important;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border} !important;
      font-weight: 600;
    }
    .ant-table-tbody > tr > td {
      background: ${({ theme }) => theme.colors.tableRow} !important;
      color: ${({ theme }) => theme.colors.textSecondary} !important;
      border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight} !important;
    }
    .ant-table-tbody > tr:hover > td {
      background: ${({ theme }) => theme.colors.tableRowHover} !important;
    }
    
    /* Pagination styling */
    .ant-pagination-item {
      background: ${({ theme }) => theme.colors.backgroundCard} !important;
      border-color: ${({ theme }) => theme.colors.border} !important;
      a {
        color: ${({ theme }) => theme.colors.textSecondary} !important;
      }
      &-active {
        border-color: ${({ theme }) => theme.colors.primary} !important;
        a {
          color: ${({ theme }) => theme.colors.primary} !important;
        }
      }
    }
    .ant-pagination-prev, .ant-pagination-next {
      .ant-pagination-item-link {
        background: ${({ theme }) => theme.colors.backgroundCard} !important;
        border-color: ${({ theme }) => theme.colors.border} !important;
        color: ${({ theme }) => theme.colors.textSecondary} !important;
      }
      &:not(.ant-pagination-disabled):hover .ant-pagination-item-link {
        border-color: ${({ theme }) => theme.colors.primary} !important;
        color: ${({ theme }) => theme.colors.primary} !important;
      }
    }
  }
`;

const ThemedStatusTag = styled(Tag)`
  && {
    border-radius: 4px;
    font-weight: 500;
    padding: 2px 8px;
    background-color: ${({ status, theme }) => {
      switch (String(status).toLowerCase()) {
        case "scheduled": return theme.colors.infoLight || 'rgba(49, 130, 206, 0.1)';
        case "confirmed": return theme.colors.successLight || 'rgba(56, 161, 105, 0.1)';
        case "completed": return theme.colors.primaryLight || 'rgba(124, 92, 191, 0.1)';
        case "cancelled": return theme.colors.dangerLight || 'rgba(229, 62, 62, 0.1)';
        default: return theme.colors.badgeBackground || 'rgba(0, 0, 0, 0.05)';
      }
    }} !important;
    color: ${({ status, theme }) => {
      switch (String(status).toLowerCase()) {
        case "scheduled": return theme.colors.info;
        case "confirmed": return theme.colors.success;
        case "completed": return theme.colors.primary;
        case "cancelled": return theme.colors.danger;
        default: return theme.colors.textSecondary;
      }
    }} !important;
    border: 1px solid ${({ status, theme }) => {
      switch (String(status).toLowerCase()) {
        case "scheduled": return theme.colors.info;
        case "confirmed": return theme.colors.success;
        case "completed": return theme.colors.primary;
        case "cancelled": return theme.colors.danger;
        default: return theme.colors.border;
      }
    }}20 !important;
  }
`;

const StyledSelect = styled(Select)`
  && {
    width: 160px;
    height: 40px;
    
    .ant-select-selector {
      background-color: ${({ theme }) => theme.colors.inputBackground} !important;
      border-color: ${({ theme }) => theme.colors.inputBorder} !important;
      color: ${({ theme }) => theme.colors.textPrimary} !important;
      height: 40px !important;
      padding: 4px 11px !important;
      border-radius: 8px !important;
      
      &:hover, &:focus {
        border-color: ${({ theme }) => theme.colors.primary} !important;
      }
    }
    
    &.ant-select-focused .ant-select-selector {
      border-color: ${({ theme }) => theme.colors.primary} !important;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20 !important;
    }
    
    .ant-select-arrow {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
    }
    
    .ant-select-selection-item {
      color: ${({ theme }) => theme.colors.textPrimary} !important;
      font-weight: 500;
      line-height: 30px !important;
    }
  }
`;

const AppointmentIdText = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;

const AlertWrapper = styled(StyledAlert)`
  && {
    margin-bottom: 16px;
  }
`;

const EmptyStateContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  
  .icon {
    color: ${({ theme }) => theme.colors.textMuted} !important;
    margin-bottom: 12px;
  }
`;

export default function AppointmentList() {
  const navigate = useNavigate();
  const theme = useTheme();
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
      render: (id) => <AppointmentIdText>APT-{String(id).padStart(4, "0")}</AppointmentIdText>,
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
        <ThemedStatusTag status={status}>
          {status}
        </ThemedStatusTag>
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
              <PageTitle as="h2">
                Appointments & Scheduling
              </PageTitle>
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
              <SearchToolbar>
                <FilterWrapper>
                  <StyledTextField
                    label="Search Patient/Doctor"
                    placeholder="Search name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 240 }}
                  />
                  
                  <StyledSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    dropdownStyle={{
                      backgroundColor: theme.colors.backgroundCard,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    <Select.Option value="all">All Statuses</Select.Option>
                    <Select.Option value="scheduled">Scheduled</Select.Option>
                    <Select.Option value="confirmed">Confirmed</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                  </StyledSelect>
                </FilterWrapper>
              </SearchToolbar>

              {error && (
                <AlertWrapper severity="error">
                  {error}
                </AlertWrapper>
              )}

              <StyledTable
                columns={columns}
                dataSource={filteredAppointments}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                locale={{
                  emptyText: (
                    <EmptyStateContainer>
                      <Icon name="calendar alternate outline" size="huge" className="icon" />
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
