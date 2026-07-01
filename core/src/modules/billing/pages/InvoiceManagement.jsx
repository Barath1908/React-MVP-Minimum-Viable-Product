import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  Table,
  Button,
  Input,
  Form,
} from "antd";

import useBilling from "../hooks/useBilling";

const InvoiceManagement = () => {
  const {
    invoices,
    loading,
    fetchInvoices,
    createInvoice,
    deleteInvoice,
  } = useBilling();

  const [form] =
    Form.useForm();

  const [open,
    setOpen] =
    useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSubmit = (
    values
  ) => {
    createInvoice(values);

    form.resetFields();

    setOpen(false);
  };

  const columns = [
    {
      title:
        "Patient Name",
      dataIndex:
        "patientName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          danger
          onClick={() =>
            deleteInvoice(
              record.id
            )
          }
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <Card title="Billing">
        <Button
          type="primary"
          onClick={() =>
            setOpen(true)
          }
          style={{
            marginBottom: 16,
          }}
        >
          Add Invoice
        </Button>

        {open && (
          <Form
            form={form}
            layout="vertical"
            onFinish={
              handleSubmit
            }
          >
            <Form.Item
              name="patientName"
              label="Patient Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Button
              htmlType="submit"
              type="primary"
            >
              Save
            </Button>
          </Form>
        )}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={
            invoices
          }
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default InvoiceManagement;