import {
  Table,
  Space,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { Button } from "@mui/material";

const PrescriptionTable = ({
  prescriptions,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title:
        "Patient Name",
      dataIndex:
        "patientName",
    },

    {
      title:
        "Doctor Name",
      dataIndex:
        "doctorName",
    },

    {
      title:
        "Medicine",
      dataIndex:
        "medicine",
    },

    {
      title: "Date",
      dataIndex: "date",
    },

    {
      title: "Actions",

      render: (
        _,
        record
      ) => (
        <Space>
          <Button
            variant="contained"
            startIcon={
              <EditOutlined />
            }
            onClick={() =>
              onEdit(record)
            }
          >
            Edit
          </Button>

          <Button
            color="error"
            variant="contained"
            startIcon={
              <DeleteOutlined />
            }
            onClick={() =>
              onDelete(
                record.id
              )
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={
        prescriptions
      }
      loading={loading}
    />
  );
};

export default PrescriptionTable;