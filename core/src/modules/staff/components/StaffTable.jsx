import { Table, Tag, Space } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { Button } from "@mui/material";

const StaffTable = ({
  staff,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Name",
      render: (_, record) =>
        `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      render: (_, record) =>
          record.is_active ? "Active" : "Inactive",
    },
    {
      title: "Actions",
      render: (_, record) => (
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
              onDelete(record.id)
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
      dataSource={staff}
      loading={loading}
    />
  );
};

export default StaffTable;