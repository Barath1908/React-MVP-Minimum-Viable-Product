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

const SearchWrapper = styled.div`
  width: 320px;
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

const EmptyStateContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors?.textSecondary || "#9094a6"};
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
      render: (id) => <strong style={{ color: "#4f8ef7" }}>#{id}</strong>,
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
        <StatusTag color={isActive ? "green" : "red"}>
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
              <Header as="h2" style={{ color: "#e8eaf6", margin: 0 }}>
                Patient Management
              </Header>
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
              <Toolbar style={{ marginBottom: "16px" }}>
                <SearchWrapper>
                  <StyledTextField
                    label="Search Patient"
                    placeholder="Search by ID, Name, Email, Phone..."
                    value={searchTerm}
                    onChange={(e) => searchPatients(e.target.value)}
                  />
                </SearchWrapper>
              </Toolbar>

              {error && (
                <StyledAlert severity="error" style={{ marginBottom: "16px" }}>
                  {error}
                </StyledAlert>
              )}

              <Table
                columns={columns}
                dataSource={patients}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                locale={{
                  emptyText: (
                    <EmptyStateContainer>
                      <Icon name="user outline" size="huge" style={{ marginBottom: "12px" }} />
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
