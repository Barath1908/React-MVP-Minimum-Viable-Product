import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Modal, message } from "antd";
import { Grid, Header, Icon } from "semantic-ui-react";
import usePatients from "../../modules/patients/hooks/usePatients";
import {
  StyledButton,
  StyledTextField,
  StyledCard,
  StyledAlert,
} from "../../components/common";
import styled from "styled-components";

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

const SearchWrapper = styled.div`
  width: 320px;
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

const StatusTag = styled(Tag)`
  && {
    border-radius: 4px;
    font-weight: 500;
    padding: 2px 8px;
    background-color: ${({ active, theme }) => active ? theme.colors.successLight || 'rgba(56, 161, 105, 0.1)' : theme.colors.dangerLight || 'rgba(229, 62, 62, 0.1)'} !important;
    color: ${({ active, theme }) => active ? theme.colors.success : theme.colors.danger} !important;
    border: 1px solid ${({ active, theme }) => active ? theme.colors.success : theme.colors.danger}20 !important;
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

const PatientIdText = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;

const AlertWrapper = styled(StyledAlert)`
  && {
    margin-bottom: 16px;
  }
`;

export default function PatientList() {
  const navigate = useNavigate();
  const {
    patients,
    loading,
    error,
    searchTerm,
    fetchPatients,
    deletePatient,
    searchPatients,
  } = usePatients();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDeleteClick = (id) => {
    setSelectedPatientId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPatientId) {
      deletePatient(selectedPatientId);
      message.success("Patient record archived successfully!");
      setDeleteConfirmOpen(false);
      setSelectedPatientId(null);
    }
  };

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <PatientIdText>#{id}</PatientIdText>,
    },
    {
      title: "Patient Name",
      key: "name",
      render: (_, record) => `${record.first_name || ""} ${record.last_name || ""}`,
      sorter: (a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "N/A"),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age) => age || "N/A",
    },
    {
      title: "Blood Group",
      dataIndex: "blood_group",
      key: "blood_group",
      render: (bg) => bg || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <StatusTag active={isActive}>
          {isActive ? "Active" : "Inactive"}
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
            onClick={() => navigate(`/patients/${record.id}`)}
          >
            View
          </StyledButton>
          <StyledButton
            variant="outlined"
            size="small"
            onClick={() => navigate(`/patients/edit/${record.id}`)}
          >
            Edit
          </StyledButton>
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
                Patient Management
              </PageTitle>
              <StyledButton
                variant="contained"
                onClick={() => navigate("/patients/new")}
              >
                Add New Patient
              </StyledButton>
            </Toolbar>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <StyledCard>
              <SearchToolbar>
                <SearchWrapper>
                  <StyledTextField
                    label="Search Patient"
                    placeholder="Search by ID, Name, Email, Phone..."
                    value={searchTerm}
                    onChange={(e) => searchPatients(e.target.value)}
                  />
                </SearchWrapper>
              </SearchToolbar>

              {error && (
                <AlertWrapper severity="error">
                  {error}
                </AlertWrapper>
              )}

              <StyledTable
                columns={columns}
                dataSource={patients}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                locale={{
                  emptyText: (
                    <EmptyStateContainer>
                      <Icon name="user outline" size="huge" className="icon" />
                      <p>No patients found. Click 'Add New Patient' to get started.</p>
                    </EmptyStateContainer>
                  ),
                }}
              />
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal
        title="Archive Patient Record"
        open={deleteConfirmOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        okText="Archive / Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to archive this patient record? This will soft delete their information.</p>
      </Modal>
    </PageContainer>
  );
}
