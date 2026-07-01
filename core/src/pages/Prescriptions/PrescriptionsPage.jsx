import { useEffect, useState } from "react";
import { Form, Table, Tag, message as antMsg } from "antd";
import { MenuItem, Box, Typography, CardContent, Grid as MuiGrid } from "@mui/material";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import usePrescriptions from "../../modules/prescriptions/hooks/usePrescriptions";
import useAuth from "../../modules/auth/hooks/useAuth";
import { ROLES } from "../../utils/constants";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";
import {
  StyledButton,
  StyledTextField,
  StyledModal,
  StyledCard,
  StyledAlert,
} from "../../components/common";

// ---------- Styled Components ----------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricsContainer = styled.div`
  margin-bottom: 12px;
`;

const MetricCard = styled(StyledCard)`
  background: ${({ theme }) => theme?.colors?.sidebar || "#09090b"} !important;
  border: 1px solid ${({ theme }) => theme?.colors?.border || "#1e2130"} !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
`;

const MetricValue = styled(Typography)`
  font-size: 28px !important;
  font-weight: 700 !important;
  color: ${({ theme }) => theme?.colors?.primary || "#7c5cbf"} !important;
  margin-top: 8px !important;
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
`;

const PrescriptionsPage = () => {
  const { user } = useAuth();
  const {
    prescriptions,
    loading,
    error,
    fetchPrescriptions,
    issuePrescription,
    verifyPrescription,
    dispensePrescription,
  } = usePrescriptions();

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [apptsLoading, setApptsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPrescriptions();
    if (user?.role === ROLES.PROVIDER || user?.role === ROLES.ADMIN || user?.role === ROLES.NURSE) {
      loadPatientsAndAppointments();
    }
  }, [fetchPrescriptions, user]);

  const loadPatientsAndAppointments = async () => {
    try {
      setPatientsLoading(true);
      setApptsLoading(true);
      
      const ptRes = await axiosClient.get("/patients");
      const ptData = ptRes?.data?.payload?.data ?? ptRes?.data ?? [];
      setPatients(ptData);

      const appRes = await axiosClient.get("/appointments");
      const appData = appRes?.data?.payload?.data ?? appRes?.data ?? [];
      setAppointments(appData);
    } catch (err) {
      console.error("Failed to load list dependencies", err);
    } finally {
      setPatientsLoading(false);
      setApptsLoading(false);
    }
  };

  const handleOpenIssue = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleIssueSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        patient_id: values.patient_id,
        appointment_id: values.appointment_id || null,
        provider_id: user.id,
        medications: values.medications,
        instructions: values.instructions || "",
      };

      await issuePrescription(payload);
      antMsg.success("Prescription issued successfully!");
      setModalOpen(false);
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return;
      antMsg.error(err?.message || "Failed to issue prescription.");
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyPrescription(id);
      antMsg.success("Prescription verified successfully!");
    } catch (err) {
      antMsg.error(err?.message || "Verification failed.");
    }
  };

  const handleDispense = async (id) => {
    try {
      await dispensePrescription(id);
      antMsg.success("Medicines dispensed successfully!");
    } catch (err) {
      antMsg.error(err?.message || "Dispensing failed.");
    }
  };

  const getStatusTag = (status) => {
    let color = "gold";
    if (status === "verified") color = "blue";
    if (status === "dispensed") color = "green";
    if (status === "cancelled") color = "red";
    return (
      <Tag color={color} style={{ textTransform: "uppercase", fontWeight: "bold" }}>
        {status}
      </Tag>
    );
  };

  const getPatientName = (patientId) => {
    const pt = patients.find((p) => p.id === patientId);
    return pt ? `${pt.first_name} ${pt.last_name}` : `Patient #${patientId}`;
  };

  const filteredPrescriptions = (prescriptions || []).filter((p) => {
    if (!p) return false;
    if (user?.role === ROLES.PATIENT) {
      return Number(p.patient_id) === Number(user.id);
    }
    return true;
  });

  // Calculate metrics
  const totalCount = filteredPrescriptions.length;
  const pendingCount = filteredPrescriptions.filter((p) => p && p.status === "issued").length;
  const verifiedCount = filteredPrescriptions.filter((p) => p && p.status === "verified").length;
  const dispensedCount = filteredPrescriptions.filter((p) => p && p.status === "dispensed").length;

  const columns = [
    {
      title: "Rx ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <strong>#Rx-{id}</strong>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Patient",
      dataIndex: "patient_id",
      key: "patient",
      render: (pId) => (user?.role === ROLES.PATIENT ? "Me" : getPatientName(pId)),
    },
    {
      title: "Medications",
      dataIndex: "medications",
      key: "medications",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Instructions",
      dataIndex: "instructions",
      key: "instructions",
      render: (text) => <span style={{ opacity: 0.8, fontSize: "13px" }}>{text || "-"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Issued", value: "issued" },
        { text: "Verified", value: "verified" },
        { text: "Dispensed", value: "dispensed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Issued Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => dayjs(date).format("MMM DD, YYYY hh:mm A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isPharmacist = user?.role === ROLES.PHARMACIST || user?.role === ROLES.ADMIN;
        if (!isPharmacist) return "-";

        if (record.status === "issued") {
          return (
            <StyledButton variant="contained" size="small" onClick={() => handleVerify(record.id)}>
              Verify Rx
            </StyledButton>
          );
        }
        if (record.status === "verified") {
          return (
            <StyledButton
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleDispense(record.id)}
            >
              Dispense Rx
            </StyledButton>
          );
        }
        return "-";
      },
    },
  ];

  return (
    <Container>
      <HeaderRow>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Prescription Logs & Pharmacy
        </Typography>
        {user?.role === ROLES.PROVIDER && (
          <StyledButton variant="contained" onClick={handleOpenIssue}>
            Issue New Prescription
          </StyledButton>
        )}
      </HeaderRow>

      {error && <StyledAlert severity="error">{error}</StyledAlert>}

      {/* Metrics Row */}
      <MetricsContainer>
        <MuiGrid container spacing={3}>
          <MuiGrid item xs={12} sm={3}>
            <MetricCard>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: "#9094a6" }}>
                  TOTAL PRESCRIPTIONS
                </Typography>
                <MetricValue>{totalCount}</MetricValue>
              </CardContent>
            </MetricCard>
          </MuiGrid>
          <MuiGrid item xs={12} sm={3}>
            <MetricCard>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: "#gold" }}>
                  PENDING VERIFICATION
                </Typography>
                <MetricValue sx={{ color: "gold !important" }}>{pendingCount}</MetricValue>
              </CardContent>
            </MetricCard>
          </MuiGrid>
          <MuiGrid item xs={12} sm={3}>
            <MetricCard>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: "#3182ce" }}>
                  VERIFIED RX
                </Typography>
                <MetricValue sx={{ color: "#3182ce !important" }}>{verifiedCount}</MetricValue>
              </CardContent>
            </MetricCard>
          </MuiGrid>
          <MuiGrid item xs={12} sm={3}>
            <MetricCard>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: "#48bb78" }}>
                  DISPENSED MEDICINES
                </Typography>
                <MetricValue sx={{ color: "#48bb78 !important" }}>{dispensedCount}</MetricValue>
              </CardContent>
            </MetricCard>
          </MuiGrid>
        </MuiGrid>
      </MetricsContainer>

      {/* Table Container */}
      <StyledTableContainer>
        <Table
          dataSource={filteredPrescriptions}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </StyledTableContainer>

      {/* Issue Rx Modal */}
      <StyledModal
        title="Issue New Prescription"
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
          <StyledButton key="submit" variant="contained" onClick={handleIssueSubmit}>
            Issue Prescription
          </StyledButton>,
        ]}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Form.Item
            name="patient_id"
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: "15px" }}
          >
            <StyledTextField
              select
              label="Select Patient"
              disabled={patientsLoading}
              slotProps={{
                select: {
                  MenuProps: {
                    disablePortal: true,
                  },
                },
              }}
            >
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} (ID: {p.id})
                </MenuItem>
              ))}
            </StyledTextField>
          </Form.Item>

          <Form.Item name="appointment_id" style={{ marginBottom: "15px" }}>
            <StyledTextField
              select
              label="Link Appointment Session (Optional)"
              disabled={apptsLoading}
              slotProps={{
                select: {
                  MenuProps: {
                    disablePortal: true,
                  },
                },
              }}
            >
              <MenuItem value="">-- No Appointment Link --</MenuItem>
              {appointments.map((appt) => (
                <MenuItem key={appt.id} value={appt.id}>
                  Session #{appt.id} - {dayjs(appt.appointment_date).format("MMM DD, YYYY")}
                </MenuItem>
              ))}
            </StyledTextField>
          </Form.Item>

          <Form.Item
            name="medications"
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: "15px" }}
          >
            <StyledTextField
              label="Medications & Dosages"
              placeholder="e.g. Paracetamol 500mg 1-0-1, Amoxicillin 250mg 1-1-1"
              multiline
              rows={3}
            />
          </Form.Item>

          <Form.Item name="instructions" style={{ marginBottom: "15px" }}>
            <StyledTextField
              label="Instructions / Advice"
              placeholder="e.g. Take after meals, complete the 5-day course"
              multiline
              rows={2}
            />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
};

export default PrescriptionsPage;
