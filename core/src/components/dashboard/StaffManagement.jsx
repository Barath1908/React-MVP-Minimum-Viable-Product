import { useEffect, useState } from "react";
import { Form, Table, Switch, Tag, message as antMsg } from "antd";
import { MenuItem, Box, Typography } from "@mui/material";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import useUsers from "../../modules/users/hooks/useUsers";
import {
  StyledButton,
  StyledTextField,
  StyledModal,
  StyledCard,
  StyledAlert,
} from "../common";

// ---------- Styled Components ----------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledTableContainer = styled.div`
  background: ${({ theme }) => theme?.colors?.sidebar || "#09090b"};
  border: 1px solid ${({ theme }) => theme?.colors?.border || "#1e2130"};
  border-radius: 8px;
  overflow: hidden;

  /* Ant Design Table Theme Overrides */
  .ant-table {
    background: transparent !important;
    color: ${({ theme }) => theme?.colors?.textPrimary || "#ffffff"} !important;
  }
  .ant-table-thead > tr > th {
    background: rgba(124, 92, 191, 0.04) !important;
    color: ${({ theme }) => theme?.colors?.textSecondary || "#9094a6"} !important;
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || "#1e2130"} !important;
    font-weight: 600;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || "#1e2130"} !important;
    background: transparent !important;
    color: ${({ theme }) => theme?.colors?.textPrimary || "#ffffff"} !important;
  }
  .ant-table-tbody > tr:hover > td {
    background: rgba(124, 92, 191, 0.02) !important;
  }
  .ant-pagination-item-active {
    border-color: ${({ theme }) => theme?.colors?.primary || "#7c5cbf"} !important;
    background: transparent !important;
    a {
      color: ${({ theme }) => theme?.colors?.primary || "#7c5cbf"} !important;
    }
  }
  .ant-pagination-item a {
    color: ${({ theme }) => theme?.colors?.textSecondary || "#9094a6"} !important;
  }
  .ant-pagination-prev, .ant-pagination-next {
    button {
      color: ${({ theme }) => theme?.colors?.textSecondary || "#9094a6"} !important;
    }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const StaffManagement = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingStaff(record);
    form.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      phone: record.phone || "",
      role: record.role,
      specialization: record.specialization || "",
      qualification: record.qualification || "",
      license_number: record.license_number || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingStaff) {
        await updateUser(editingStaff.id, values);
        antMsg.success("Staff member updated successfully!");
      } else {
        await addUser(values);
        antMsg.success("Staff member added successfully!");
      }
      setModalOpen(false);
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return; // Form validation failed
      antMsg.error(err?.message || "Operation failed.");
    }
  };

  const handleToggleActive = async (checked, record) => {
    try {
      await toggleUserStatus(record.id, checked);
      antMsg.success(
        `Staff member ${checked ? "activated" : "deactivated"} successfully!`
      );
    } catch (err) {
      antMsg.error(err?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (record) => {
    if (window.confirm(`Are you sure you want to delete ${record.first_name}?`)) {
      try {
        await deleteUser(record.id);
        antMsg.success("Staff member deleted successfully!");
      } catch (err) {
        antMsg.error(err?.message || "Delete failed.");
      }
    }
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {record.first_name} {record.last_name}
        </span>
      ),
      sorter: (a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "blue";
        if (role === "provider") color = "purple";
        if (role === "nurse") color = "cyan";
        if (role === "pharmacist") color = "green";
        if (role === "receptionist") color = "orange";
        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {role === "provider" ? "Doctor" : role}
          </Tag>
        );
      },
      filters: [
        { text: "Doctor", value: "provider" },
        { text: "Nurse", value: "nurse" },
        { text: "Pharmacist", value: "pharmacist" },
        { text: "Receptionist", value: "receptionist" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Contact Info",
      key: "contact",
      render: (_, record) => (
        <div>
          <div style={{ fontSize: "13px" }}>{record.email}</div>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Credentials",
      key: "credentials",
      render: (_, record) => (
        <div>
          {record.specialization && (
            <div style={{ fontSize: "13px" }}>
              <strong>Spec:</strong> {record.specialization}
            </div>
          )}
          {record.qualification && (
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              <strong>Qual:</strong> {record.qualification}
            </div>
          )}
          {record.license_number && (
            <div style={{ fontSize: "11px", opacity: 0.6 }}>
              <strong>License:</strong> {record.license_number}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      render: (is_active, record) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Switch
            checked={Number(is_active) === 1}
            onChange={(checked) => handleToggleActive(checked, record)}
            size="small"
          />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {Number(is_active) === 1 ? "Active" : "Inactive"}
          </Typography>
        </Box>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <ActionGroup>
          <StyledButton
            variant="outlined"
            size="small"
            onClick={() => handleOpenEdit(record)}
            sx={{ minWidth: "auto", px: 1.5, py: 0.5 }}
          >
            Edit
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(record)}
            sx={{ minWidth: "auto", px: 1.5, py: 0.5 }}
          >
            Delete
          </StyledButton>
        </ActionGroup>
      ),
    },
  ];

  return (
    <Container>
      <HeaderRow>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Staff Management
        </Typography>
        <StyledButton variant="contained" onClick={handleOpenAdd}>
          Add Staff Member
        </StyledButton>
      </HeaderRow>

      {error && <StyledAlert severity="error">{error}</StyledAlert>}

      <StyledTableContainer>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </StyledTableContainer>

      {/* Add/Edit Modal */}
      <StyledModal
        title={editingStaff ? "Edit Staff Member" : "Add Staff Member"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <StyledButton
            key="cancel"
            variant="outlined"
            onClick={() => setModalOpen(false)}
            sx={{ mr: 1 }}
          >
            Cancel
          </StyledButton>,
          <StyledButton key="submit" variant="contained" onClick={handleSave}>
            Save
          </StyledButton>,
        ]}
        width={550}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: "Required" }]}
              style={{ flex: 1, marginBottom: "15px" }}
            >
              <StyledTextField label="First Name" />
            </Form.Item>
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: "Required" }]}
              style={{ flex: 1, marginBottom: "15px" }}
            >
              <StyledTextField label="Last Name" />
            </Form.Item>
          </Box>

          <Form.Item
            name="role"
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: "15px" }}
          >
            <StyledTextField
              select
              label="Staff Role"
              slotProps={{
                select: {
                  MenuProps: {
                    disablePortal: true,
                  },
                },
              }}
            >
              <MenuItem value="provider">Doctor (Provider)</MenuItem>
              <MenuItem value="nurse">Nurse</MenuItem>
              <MenuItem value="pharmacist">Pharmacist</MenuItem>
              <MenuItem value="receptionist">Receptionist</MenuItem>
            </StyledTextField>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email" },
            ]}
            style={{ marginBottom: "15px" }}
          >
            <StyledTextField label="Email Address" type="email" />
          </Form.Item>

          <Form.Item name="phone" style={{ marginBottom: "15px" }}>
            <StyledTextField label="Phone Number" />
          </Form.Item>

          {!editingStaff && (
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Required" },
                { min: 8, message: "Min. 8 characters" },
              ]}
              style={{ marginBottom: "15px" }}
            >
              <StyledTextField label="Password" type="password" />
            </Form.Item>
          )}

          <Form.Item name="specialization" style={{ marginBottom: "15px" }}>
            <StyledTextField label="Specialization (e.g. Cardiology)" />
          </Form.Item>

          <Form.Item name="qualification" style={{ marginBottom: "15px" }}>
            <StyledTextField label="Qualification (e.g. MBBS, MD)" />
          </Form.Item>

          <Form.Item name="license_number" style={{ marginBottom: "15px" }}>
            <StyledTextField label="Medical License Number" />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
};

export default StaffManagement;
