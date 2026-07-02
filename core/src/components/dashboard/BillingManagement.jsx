import { useEffect, useState } from "react";
import { Form, Table, Tag, message as antMsg, DatePicker } from "antd";
import { MenuItem, Box, Typography, CardContent, Grid as MuiGrid } from "@mui/material";
import styled from "styled-components";
import useBilling from "../../modules/billing/hooks/useBilling";
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
} from "../common";

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

const StyledDatePicker = styled(DatePicker)`
  width: 100% !important;
  background-color: transparent !important;
  border: 1px solid ${props => props.theme.colors?.border || '#2a2d3e'} !important;
  height: 40px !important;
  border-radius: 8px !important;
  color: ${props => props.theme.colors?.textPrimary || '#ffffff'} !important;

  &:hover {
    border-color: ${props => props.theme.colors?.primary || '#7c5cbf'} !important;
  }

  .ant-picker-input > input {
    color: ${props => props.theme.colors?.textPrimary || '#ffffff'} !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 14px !important;
  }
  
  .ant-picker-suffix {
    color: ${props => props.theme.colors?.textSecondary || '#9094a6'} !important;
  }
`;

const BillingManagement = () => {
  const { user } = useAuth();
  const {
    invoices,
    summary,
    loading,
    error,
    fetchInvoices,
    fetchSummary,
    createInvoice,
    recordPayment,
  } = useBilling();

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();

  // Watching total/discount/tax to calculate final amount in Form
  const totalAmount = Form.useWatch("total_amount", form) || 0;
  const discountAmount = Form.useWatch("discount_amount", form) || 0;
  const taxAmount = Form.useWatch("tax_amount", form) || 0;
  const finalCalculated = Number(totalAmount) - Number(discountAmount) + Number(taxAmount);

  useEffect(() => {
    fetchInvoices();
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.PROVIDER) {
      fetchSummary();
      loadPatients();
    }
  }, [fetchInvoices, fetchSummary, user]);

  const loadPatients = async () => {
    try {
      setPatientsLoading(true);
      const res = await axiosClient.get("/patients");
      const data = res?.data?.payload?.data ?? res?.data ?? [];
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients list", err);
    } finally {
      setPatientsLoading(false);
    }
  };

  const handleOpenCreateInvoice = () => {
    form.resetFields();
    setInvoiceModalOpen(true);
  };

  const handleCreateInvoiceSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        patient_id: values.patient_id,
        total_amount: Number(values.total_amount),
        discount_amount: Number(values.discount_amount || 0),
        tax_amount: Number(values.tax_amount || 0),
        due_date: values.due_date ? values.due_date.format("YYYY-MM-DD") : null,
        notes: values.notes || null,
      };

      await createInvoice(payload);
      antMsg.success("Invoice generated successfully!");
      setInvoiceModalOpen(false);
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return;
      antMsg.error(err?.message || "Failed to create invoice.");
    }
  };

  const handleOpenRecordPayment = (invoice) => {
    setSelectedInvoice(invoice);
    paymentForm.resetFields();
    paymentForm.setFieldsValue({
      amount: invoice.final_amount,
    });
    setPaymentModalOpen(true);
  };

  const handleRecordPaymentSubmit = async () => {
    try {
      const values = await paymentForm.validateFields();
      const payload = {
        invoice_id: selectedInvoice.id,
        amount: Number(values.amount),
        payment_method: values.payment_method,
        transaction_ref: values.transaction_ref || null,
      };

      await recordPayment(payload);
      antMsg.success("Payment recorded successfully!");
      setPaymentModalOpen(false);
      paymentForm.resetFields();
    } catch (err) {
      if (err?.errorFields) return;
      antMsg.error(err?.message || "Failed to record payment.");
    }
  };

  const filteredInvoices = user?.role === ROLES.PATIENT
    ? invoices.filter((inv) => Number(inv.patient_id) === Number(user.id))
    : invoices;

  const getStatusTag = (status) => {
    let color = "gold";
    if (status === "paid") color = "green";
    if (status === "partially_paid") color = "blue";
    if (status === "cancelled") color = "red";
    return (
      <Tag color={color} style={{ textTransform: "uppercase", fontWeight: "bold" }}>
        {status.replace("_", " ")}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <strong>#INV-{id}</strong>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Patient ID",
      dataIndex: "patient_id",
      key: "patient_id",
      render: (pId) => {
        if (user?.role === ROLES.PATIENT) return "Me";
        const p = patients.find((pt) => pt.id === pId);
        return p ? `${p.first_name} ${p.last_name}` : `Patient #${pId}`;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (val) => `$${Number(val).toFixed(2)}`,
    },
    {
      title: "Final Amount",
      dataIndex: "final_amount",
      key: "final_amount",
      render: (val) => (
        <span style={{ fontWeight: 600, color: "#38a169" }}>
          ${Number(val).toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.final_amount - b.final_amount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Draft", value: "draft" },
        { text: "Issued", value: "issued" },
        { text: "Partially Paid", value: "partially_paid" },
        { text: "Paid", value: "paid" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (date) => (date ? dayjs(date).format("MMM DD, YYYY") : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const canPay = user?.role === ROLES.PATIENT && record.status !== "paid" && record.status !== "cancelled";
        const canRecordAdmin = (user?.role === ROLES.ADMIN || user?.role === ROLES.PROVIDER) && record.status !== "paid" && record.status !== "cancelled";
        
        if (canPay || canRecordAdmin) {
          return (
            <StyledButton
              variant="contained"
              size="small"
              onClick={() => handleOpenRecordPayment(record)}
            >
              {user?.role === ROLES.PATIENT ? "Pay Invoice" : "Record Payment"}
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
          Patient Billing & Invoices
        </Typography>
        {(user?.role === ROLES.ADMIN || user?.role === ROLES.PROVIDER) && (
          <StyledButton variant="contained" onClick={handleOpenCreateInvoice}>
            Generate New Invoice
          </StyledButton>
        )}
      </HeaderRow>

      {error && <StyledAlert severity="error">{error}</StyledAlert>}

      {/* Metrics Row (Admins/Providers only) */}
      {(user?.role === ROLES.ADMIN || user?.role === ROLES.PROVIDER) && summary && (
        <MetricsContainer>
          <MuiGrid container spacing={3}>
            <MuiGrid xs={12} sm={3}>
              <MetricCard>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: "#9094a6" }}>
                    TOTAL INVOICES
                  </Typography>
                  <MetricValue>{summary.total_invoices ?? 0}</MetricValue>
                </CardContent>
              </MetricCard>
            </MuiGrid>
            <MuiGrid xs={12} sm={3}>
              <MetricCard>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: "#48bb78" }}>
                    FULLY PAID
                  </Typography>
                  <MetricValue sx={{ color: "#48bb78 !important" }}>
                    {summary.paid ?? 0}
                  </MetricValue>
                </CardContent>
              </MetricCard>
            </MuiGrid>
            <MuiGrid xs={12} sm={3}>
              <MetricCard>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: "#3182ce" }}>
                    PARTIALLY PAID
                  </Typography>
                  <MetricValue sx={{ color: "#3182ce !important" }}>
                    {summary.partially_paid ?? 0}
                  </MetricValue>
                </CardContent>
              </MetricCard>
            </MuiGrid>
            <MuiGrid xs={12} sm={3}>
              <MetricCard>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: "#e53e3e" }}>
                    CANCELLED
                  </Typography>
                  <MetricValue sx={{ color: "#e53e3e !important" }}>
                    {summary.cancelled ?? 0}
                  </MetricValue>
                </CardContent>
              </MetricCard>
            </MuiGrid>
          </MuiGrid>
        </MetricsContainer>
      )}

      {/* Invoices Table */}
      <StyledTableContainer>
        <Table
          dataSource={filteredInvoices}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </StyledTableContainer>

      {/* Generate Invoice Modal */}
      <StyledModal
        title="Generate New Invoice"
        open={invoiceModalOpen}
        onCancel={() => setInvoiceModalOpen(false)}
        footer={[
          <StyledButton
            key="cancel"
            variant="outlined"
            onClick={() => setInvoiceModalOpen(false)}
            sx={{ mr: 1 }}
          >
            Cancel
          </StyledButton>,
          <StyledButton key="submit" variant="contained" onClick={handleCreateInvoiceSubmit}>
            Generate Invoice
          </StyledButton>,
        ]}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Form.Item
            name="patient_id"
            label=""
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

          <Form.Item
            name="total_amount"
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: "15px" }}
          >
            <StyledTextField label="Total Service Amount ($)" type="number" />
          </Form.Item>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Form.Item name="discount_amount" style={{ flex: 1, marginBottom: "15px" }}>
              <StyledTextField label="Discount ($)" type="number" />
            </Form.Item>
            <Form.Item name="tax_amount" style={{ flex: 1, marginBottom: "15px" }}>
              <StyledTextField label="Tax ($)" type="number" />
            </Form.Item>
          </Box>

          <Box sx={{ p: 2, mb: 2, bgcolor: "rgba(124,92,191,0.06)", borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "#9094a6" }}>
              Calculated Final Amount
            </Typography>
            <Typography variant="h5" sx={{ color: "#48bb78", fontWeight: 700 }}>
              ${finalCalculated.toFixed(2)}
            </Typography>
          </Box>

          <Form.Item
            name="due_date"
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: "15px" }}
          >
            <StyledDatePicker placeholder="Select Due Date" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="notes" style={{ marginBottom: "15px" }}>
            <StyledTextField label="Notes/Comments" multiline rows={3} />
          </Form.Item>
        </Form>
      </StyledModal>

      {/* Record Payment Modal */}
      <StyledModal
        title={user?.role === ROLES.PATIENT ? "Pay Invoice" : "Record Manual Payment"}
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={[
          <StyledButton
            key="cancel"
            variant="outlined"
            onClick={() => setPaymentModalOpen(false)}
            sx={{ mr: 1 }}
          >
            Cancel
          </StyledButton>,
          <StyledButton key="submit" variant="contained" onClick={handleRecordPaymentSubmit}>
            Record Payment
          </StyledButton>,
        ]}
        width={400}
      >
        {selectedInvoice && (
          <Box sx={{ p: 2, mb: 2, bgcolor: "rgba(124,92,191,0.06)", borderRadius: 2, mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#9094a6" }}>
              Invoice total:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ${Number(selectedInvoice.final_amount).toFixed(2)}
            </Typography>
          </Box>
        )}
        <Form form={paymentForm} layout="vertical">
          <Form.Item
            name="amount"
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: "15px" }}
          >
            <StyledTextField label="Payment Amount ($)" type="number" />
          </Form.Item>

          <Form.Item
            name="payment_method"
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: "15px" }}
          >
            <StyledTextField
              select
              label="Payment Method"
              slotProps={{
                select: {
                  MenuProps: {
                    disablePortal: true,
                  },
                },
              }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Credit/Debit Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="insurance">Insurance Claim</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </StyledTextField>
          </Form.Item>

          <Form.Item name="transaction_ref" style={{ marginBottom: "15px" }}>
            <StyledTextField label="Transaction Reference (Optional)" />
          </Form.Item>
        </Form>
      </StyledModal>
    </Container>
  );
};

export default BillingManagement;
